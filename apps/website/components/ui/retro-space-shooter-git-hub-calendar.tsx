'use client';

import {
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionData = {
  [date: string]: {
    level: ContributionLevel;
    label?: string;
    count?: number;
  };
};

export type ThemeColors = {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
};

export type CellShape = 'rounded' | 'circle';

export type GithubCalendarProps = {
  username?: string;
  data?: ContributionData;
  startDate?: string;
  endDate?: string;
  startsOnSunday?: boolean;
  cellSize?: number;
  cellGap?: number;
  cellShape?: CellShape;
  theme?: 'github' | ThemeColors;
  showMonthLabels?: boolean;
  showStats?: boolean;
  showLegend?: boolean;
  className?: string;
};

// ─── Built-in themes ──────────────────────────────────────────────────────────

const THEMES: Record<string, ThemeColors> = {
  github: {
    level0: '#ffffff',
    level1: '#0e4429',
    level2: '#006d32',
    level3: '#26a641',
    level4: '#39d353',
  },
};

const DARK_THEMES: Record<string, ThemeColors> = {
  github: {
    level0: '#0a0a0a',
    level1: '#0e4429',
    level2: '#006d32',
    level3: '#26a641',
    level4: '#39d353',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-').map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const FULL_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

function formatTooltipDate(dateStr: string): string {
  try {
    const date = parseDate(dateStr);
    const month = FULL_MONTH_NAMES[date.getMonth()];
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    return `${month} ${day}${suffix}`;
  } catch {
    return dateStr;
  }
}

function playSound(_type: 'laser' | 'explosion' | 'hit' | 'victory') {
  // Sound effects disabled
}

// ─── API fetch ────────────────────────────────────────────────────────────────

type APIResponse = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};

async function fetchContributions(username: string): Promise<ContributionData> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`
  );
  if (!res.ok) {
    throw new Error(
      `Could not fetch contributions for "${username}" (${res.status})`
    );
  }
  const json: APIResponse = await res.json();

  const result: ContributionData = {};
  for (const entry of json.contributions) {
    result[entry.date] = {
      level: Math.min(4, Math.max(0, entry.level)) as ContributionLevel,
      count: entry.count,
    };
  }
  return result;
}

// ─── Build calendar grid ──────────────────────────────────────────────────────

function buildGrid(
  startDate: string,
  endDate: string,
  startsOnSunday: boolean
): {
  weeks: (string | null)[][];
  monthLabels: { label: string; weekIndex: number }[];
  gridStart: string;
} {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const startDay = startsOnSunday ? 0 : 1;
  const startDow = start.getDay();
  const offset = (startDow - startDay + 7) % 7;
  const gridStart = addDays(start, -offset);

  const weeks: (string | null)[][] = [];
  const monthLabels: { label: string; weekIndex: number }[] = [];

  let current = new Date(gridStart);
  let weekIndex = 0;
  let lastMonth = -1;

  while (
    current <= end ||
    (weeks.length > 0 && (weeks[weeks.length - 1]?.length ?? 0) < 7)
  ) {
    const week: (string | null)[] = [];

    for (let d = 0; d < 7; d++) {
      const dateStr = formatDate(current);
      const isInRange = current >= start && current <= end;
      week.push(isInRange ? dateStr : null);

      if (isInRange && current.getMonth() !== lastMonth) {
        lastMonth = current.getMonth();
        monthLabels.push({
          label: MONTH_NAMES[current.getMonth()]!,
          weekIndex,
        });
      }

      current = addDays(current, 1);
    }

    weeks.push(week);
    weekIndex++;

    if (
      current > end &&
      weeks.length > 0 &&
      (weeks[weeks.length - 1]?.every(
        (day) => day === null || parseDate(day) > end
      ) ??
        false)
    )
      break;
  }

  return { weeks, monthLabels, gridStart: formatDate(gridStart) };
}

// ─── Tooltip state type ───────────────────────────────────────────────────────

type TooltipState = {
  visible: boolean;
  date: string;
  count: number | undefined;
  label: string | undefined;
  x: number;
  y: number;
};

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function fitGrid(availableWidth: number, weekCount: number) {
  const weeks = Math.max(1, weekCount);
  const width = Math.max(1, availableWidth);
  const gapRatio = 0.1;
  const cellGap = Math.max(1, (width / weeks) * gapRatio);
  const cellSize = (width - cellGap * (weeks - 1)) / weeks;
  return {
    cellSize: Math.max(3, cellSize),
    cellGap,
  };
}

function CalendarSkeleton({
  cellSize = 8,
  cellGap = 1.5,
  className,
}: {
  cellSize?: number;
  cellGap?: number;
  className?: string;
}) {
  const step = cellSize + cellGap;
  const weeks = 53;
  const days = 7;
  const svgWidth = weeks * step - cellGap;
  const svgHeight = 16 + days * step - cellGap;
  return (
    <div className={cn('w-full animate-pulse space-y-3', className)}>
      <div className="flex gap-6">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
          {Array.from({ length: weeks }).map((_, wi) =>
            Array.from({ length: days }).map((__, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * step}
                y={16 + di * step}
                width={cellSize}
                height={cellSize}
                rx={cellSize * 0.2}
                className="fill-muted"
              />
            ))
          )}
        </svg>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const GithubCalendar = memo(function GithubCalendar({
  username,
  data: dataProp,
  startDate,
  endDate,
  startsOnSunday = true,
  cellSize: cellSizeProp,
  cellGap: cellGapProp,
  cellShape = 'rounded',
  theme = 'github',
  showMonthLabels = true,
  showStats = true,
  showLegend = true,
  className,
}: GithubCalendarProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(
        document.documentElement.classList.contains('dark') ||
          document.body.classList.contains('dark')
      );
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    const opts = { attributes: true, attributeFilter: ['class'] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);

    return () => observer.disconnect();
  }, []);

  const [fetchedData, setFetchedData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(!!username);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    setFetchedData(null);
    setFetchError(null);
    setLoading(true);

    fetchContributions(username)
      .then((next) => setFetchedData(next))
      .catch((error) =>
        setFetchError(error instanceof Error ? error.message : String(error))
      )
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      setContainerWidth(element.clientWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [loading, fetchError]);

  const data: ContributionData = dataProp ?? fetchedData ?? {};

  const resolvedEnd = endDate ?? formatDate(new Date());
  const resolvedStart = useMemo(() => {
    if (startDate) return startDate;
    const date = parseDate(resolvedEnd);
    date.setFullYear(date.getFullYear() - 1);
    date.setDate(date.getDate() + 1);
    return formatDate(date);
  }, [startDate, resolvedEnd]);

  const activeColors = useMemo(() => {
    if (typeof theme === 'object') return theme;
    return isDark ? DARK_THEMES.github : THEMES.github;
  }, [theme, isDark]);

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    date: '',
    count: undefined,
    label: undefined,
    x: 0,
    y: 0,
  });

  const { weeks, monthLabels, gridStart } = useMemo(
    () => buildGrid(resolvedStart, resolvedEnd, startsOnSunday),
    [resolvedStart, resolvedEnd, startsOnSunday]
  );

  const stats = useMemo(() => {
    const entries = Object.entries(data);
    const total = entries.reduce(
      (sum, [, value]) => sum + (value.count ?? (value.level > 0 ? 1 : 0)),
      0
    );
    const activeDays = entries.filter(([, value]) => value.level > 0).length;
    const maxStreak = (() => {
      let max = 0;
      let currentStreak = 0;
      const sorted = entries
        .filter(([, value]) => value.level > 0)
        .map(([date]) => date)
        .sort();
      for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
          currentStreak = 1;
          max = 1;
          continue;
        }
        const prev = parseDate(sorted[i - 1]!);
        const curr = parseDate(sorted[i]!);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
          currentStreak++;
          max = Math.max(max, currentStreak);
        } else currentStreak = 1;
      }
      return max;
    })();
    return { total, activeDays, maxStreak };
  }, [data]);

  const fitted = useMemo(() => {
    if (containerWidth <= 0) {
      return {
        cellSize: cellSizeProp ?? 8,
        cellGap: cellGapProp ?? 1.5,
      };
    }
    return fitGrid(containerWidth, weeks.length);
  }, [containerWidth, weeks.length, cellSizeProp, cellGapProp]);

  const cellSize = fitted.cellSize;
  const cellGap = fitted.cellGap;
  const step = cellSize + cellGap;
  const monthLabelSize = Math.max(8, Math.min(11, cellSize));
  const monthLabelHeight = showMonthLabels && !gameActive ? monthLabelSize + 6 : 0;
  const svgWidth = Math.max(1, weeks.length * step - cellGap);
  const svgHeight = monthLabelHeight + 7 * step - cellGap;
  const legendSize = Math.max(8, Math.min(10, cellSize));

  useEffect(() => {
    if (!gameActive) {
      weeks.forEach((week) => {
        week.forEach((date) => {
          if (!date) return;
          const rect = document.getElementById(`cell-${id}-${date}`);
          if (rect) {
            rect.style.opacity = '1';
            rect.style.pointerEvents = 'auto';
            const originalLevel = data[date]?.level ?? 0;
            const originalColor =
              activeColors[`level${originalLevel}` as keyof ThemeColors] ||
              activeColors.level0;
            rect.setAttribute('fill', originalColor);
          }
        });
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = svgWidth;
    const height = svgHeight + 80;
    canvas.width = width;
    canvas.height = height;

    const cellLevels = new Map<string, number>();
    weeks.forEach((week) => {
      week.forEach((date) => {
        if (!date) return;
        const entry = data[date];
        const initialLevel = entry?.level ?? 0;
        cellLevels.set(date, initialLevel);
        const rect = document.getElementById(`cell-${id}-${date}`);
        if (rect) {
          if (initialLevel === 0) {
            rect.style.opacity = '0';
            rect.style.pointerEvents = 'none';
          } else {
            rect.style.opacity = '1';
            rect.style.pointerEvents = 'auto';
          }
        }
      });
    });

    const player = {
      x: width / 2 - 15,
      y: height - 25,
      width: 30,
      height: 20,
      speed: 4,
      direction: 1,
      color: '#38bdf8',
    };

    type GameBullet = {
      x: number;
      y: number;
      vy: number;
      width: number;
      height: number;
      color: string;
    };
    let bullets: GameBullet[] = [];
    let lastShot = 0;
    const cooldown = 140;

    const shoot = () => {
      bullets.push({
        x: player.x + player.width / 2 - 1.5,
        y: player.y - 4,
        vy: -6,
        width: 3,
        height: 8,
        color: '#fbbf24',
      });
      playSound('laser');
    };

    const stars = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.4 + 0.1,
      size: Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    type GameParticle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    };
    let particles: GameParticle[] = [];
    const explode = (x: number, y: number, color: string) => {
      playSound('explosion');
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1.2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          size: Math.random() * 2 + 1,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 15 + 15,
        });
      }
    };

    const update = () => {
      let minWi = -1;
      let maxWi = -1;
      weeks.forEach((week, wi) => {
        week.forEach((date) => {
          if (!date) return;
          if ((cellLevels.get(date) ?? 0) > 0) {
            if (minWi === -1) minWi = wi;
            minWi = Math.min(minWi, wi);
            maxWi = Math.max(maxWi, wi);
          }
        });
      });

      let minX = 0;
      let maxX = width - player.width;
      if (minWi !== -1 && maxWi !== -1) {
        minX = minWi * step;
        maxX = Math.max(
          minX,
          Math.min(width - player.width, (maxWi + 1) * step - player.width)
        );
      }

      player.x = Math.max(minX, Math.min(maxX, player.x));
      player.x += player.speed * player.direction;
      if (player.x >= maxX) {
        player.x = maxX;
        player.direction = -1;
      } else if (player.x <= minX) {
        player.x = minX;
        player.direction = 1;
      }

      const now = Date.now();
      if (now - lastShot >= cooldown) {
        shoot();
        lastShot = now;
      }

      let anyActive = false;
      cellLevels.forEach((level) => {
        if (level > 0) anyActive = true;
      });

      if (!anyActive) {
        playSound('victory');
        weeks.forEach((week) => {
          week.forEach((date) => {
            if (!date) return;
            const originalLevel = data[date]?.level ?? 0;
            cellLevels.set(date, originalLevel);
            const rect = document.getElementById(`cell-${id}-${date}`);
            if (rect) {
              const originalColor =
                activeColors[`level${originalLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              rect.setAttribute('fill', originalColor);
              if (originalLevel === 0) {
                rect.style.opacity = '0';
                rect.style.pointerEvents = 'none';
              } else {
                rect.style.opacity = '1';
                rect.style.pointerEvents = 'auto';
              }
            }
          });
        });
      }

      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      });

      bullets = bullets.filter((bullet) => {
        bullet.y += bullet.vy;
        return bullet.y > 0;
      });

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;
        particle.alpha = 1 - particle.life / particle.maxLife;
      });
      particles = particles.filter((particle) => particle.life < particle.maxLife);

      bullets.forEach((bullet, bulletIdx) => {
        weeks.forEach((week, wi) => {
          week.forEach((date, di) => {
            if (!date) return;

            const currentLevel = cellLevels.get(date) ?? 0;
            if (currentLevel === 0) return;

            const cellX = wi * step;
            const cellY = monthLabelHeight + di * step;

            if (
              bullet.x < cellX + cellSize &&
              bullet.x + bullet.width > cellX &&
              bullet.y < cellY + cellSize &&
              bullet.y + bullet.height > cellY
            ) {
              bullets.splice(bulletIdx, 1);

              const newLevel = currentLevel - 1;
              cellLevels.set(date, newLevel);

              const rect = document.getElementById(`cell-${id}-${date}`);
              if (rect) {
                if (newLevel === 0) {
                  rect.style.opacity = '0';
                  rect.style.pointerEvents = 'none';
                } else {
                  const newColor =
                    activeColors[`level${newLevel}` as keyof ThemeColors] ||
                    activeColors.level0;
                  rect.setAttribute('fill', newColor);
                }
              }

              const hitColor =
                activeColors[`level${currentLevel}` as keyof ThemeColors] ||
                activeColors.level0;
              explode(cellX + cellSize / 2, cellY + cellSize / 2, hitColor);
            }
          });
        });
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#ffffff';
      stars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });
      ctx.globalAlpha = 1.0;

      bullets.forEach((bullet) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });

      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      });
      ctx.globalAlpha = 1.0;

      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.lineTo(
        player.x + player.width * 0.7,
        player.y + player.height * 0.75
      );
      ctx.lineTo(
        player.x + player.width * 0.3,
        player.y + player.height * 0.75
      );
      ctx.lineTo(player.x, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      update();
      render();
      if (gameActive) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    gameActive,
    data,
    weeks,
    step,
    cellSize,
    cellGap,
    monthLabelHeight,
    activeColors,
    id,
    svgWidth,
    svgHeight,
  ]);

  if (loading) {
    return (
      <div ref={containerRef} className={cn('w-full', className)}>
        <CalendarSkeleton cellSize={8} cellGap={1.5} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        className={cn(
          'mx-auto flex w-fit items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive text-sm',
          className
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {fetchError}
      </div>
    );
  }

  const cellRx = cellShape === 'circle' ? cellSize / 2 : cellSize * 0.2;
  const legendRx = cellShape === 'circle' ? legendSize / 2 : legendSize * 0.2;

  return (
    <div
      className={cn(
        'w-full overflow-x-hidden rounded-sm border transition-all duration-500',
        gameActive ? 'border-neutral-800 bg-black' : '',
        className
      )}
    >
      <div className="flex w-full flex-col gap-2 p-2 sm:gap-3 sm:p-3">
        <div
          ref={containerRef}
          className={cn(
            'relative w-full overflow-x-hidden',
            gameActive ? 'pb-[80px]' : ''
          )}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="block h-auto w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            {showMonthLabels &&
              !gameActive &&
              (() => {
                const byWeek = new Map<number, string>();
                monthLabels.forEach(({ label, weekIndex }) =>
                  byWeek.set(weekIndex, label)
                );
                const entries = Array.from(byWeek.entries());
                const minWeekGap = cellSize < 6 ? 5 : 3;
                const validEntries: [number, string][] = [];
                for (let i = 0; i < entries.length; i++) {
                  const current = entries[i]!;
                  const next = entries[i + 1];
                  if (i === 0 && next && next[0] - current[0] < minWeekGap) {
                    continue;
                  }
                  const lastValid = validEntries[validEntries.length - 1];
                  if (lastValid && current[0] - lastValid[0] < minWeekGap) {
                    continue;
                  }
                  validEntries.push(current);
                }
                return validEntries.map(([weekIndex, label]) => (
                  <text
                    key={`${label}-${weekIndex}`}
                    x={weekIndex * step}
                    y={monthLabelSize}
                    fontSize={monthLabelSize}
                    fill={isDark ? '#fafafa' : '#0a0a0a'}
                    fontFamily="inherit"
                  >
                    {label}
                  </text>
                ));
              })()}

            {weeks.map((week, wi) =>
              week.map((date, di) => {
                const entry = date ? data[date] : undefined;
                const level: ContributionLevel = entry?.level ?? 0;
                const cellCenterX = wi * step + cellSize / 2;
                const cellTopY = monthLabelHeight + di * step;

                if (!date) {
                  const cellDate = formatDate(
                    addDays(parseDate(gridStart), wi * 7 + di)
                  );
                  if (cellDate > resolvedEnd) return null;
                }

                return (
                  <rect
                    key={`${wi}-${di}`}
                    id={date ? `cell-${id}-${date}` : undefined}
                    x={wi * step}
                    y={cellTopY}
                    width={cellSize}
                    height={cellSize}
                    rx={cellRx}
                    fill={activeColors[`level${level}` as keyof ThemeColors]}
                    style={{
                      transition: 'opacity 0.1s',
                      opacity: gameActive ? (level === 0 || !date ? 0 : 1) : 1,
                      pointerEvents: gameActive
                        ? level === 0 || !date
                          ? 'none'
                          : 'auto'
                        : 'auto',
                    }}
                    onMouseEnter={() => {
                      if (!date || gameActive) return;
                      setTooltip({
                        visible: true,
                        date,
                        count: entry?.count,
                        label: entry?.label,
                        x: cellCenterX,
                        y: cellTopY,
                      });
                    }}
                    onMouseLeave={() =>
                      setTooltip((current) => ({ ...current, visible: false }))
                    }
                  />
                );
              })
            )}
          </svg>

          {gameActive && (
            <canvas
              ref={canvasRef}
              className="pointer-events-auto absolute inset-0 z-10 h-full w-full cursor-crosshair"
            />
          )}

          {tooltip.visible &&
            (() => {
              const count = tooltip.count ?? 0;
              const formattedDate = formatTooltipDate(tooltip.date);
              const tooltipText = tooltip.label
                ? `${tooltip.label} on ${formattedDate}.`
                : count === 0
                  ? `No contributions on ${formattedDate}.`
                  : `${count} contribution${count !== 1 ? 's' : ''} on ${formattedDate}.`;

              return (
                <div
                  className="pointer-events-none absolute z-50 whitespace-nowrap rounded border border-neutral-700/30 bg-[#24292e] px-2.5 py-1 font-medium text-[11px] text-white shadow-md dark:bg-[#161b22]"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y,
                    transform: 'translate(-50%, calc(-100% - 6px))',
                  }}
                >
                  {tooltipText}
                  <div className="absolute bottom-0 left-1/2 h-1.5 w-1.5 translate-y-1/2 -translate-x-1/2 rotate-45 border-neutral-700/30 border-r border-b bg-[#24292e] dark:bg-[#161b22]" />
                </div>
              );
            })()}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
          {showLegend && (
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs sm:gap-4">
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
                  <svg key={level} width={legendSize} height={legendSize}>
                    <rect
                      width={legendSize}
                      height={legendSize}
                      rx={legendRx}
                      fill={activeColors[`level${level}`]}
                    />
                  </svg>
                ))}
                <span>More</span>
              </div>

              <div className="flex items-center gap-2 border-neutral-800 border-l pl-4">
                <span className="select-none text-[11px] text-neutral-400">
                  Game Mode
                </span>
                <button
                  type="button"
                  aria-pressed={gameActive}
                  onClick={() => setGameActive(!gameActive)}
                  className={cn(
                    'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    gameActive ? 'bg-emerald-500' : 'bg-neutral-800'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      gameActive ? 'translate-x-4' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          )}

          {showStats && (
            <div className="flex flex-wrap font-sans text-xs tracking-wide sm:ml-auto sm:justify-end sm:text-sm">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-wrap select-none items-center gap-x-1 text-neutral-400"
              >
                <span className="font-semibold text-neutral-200">
                  {username}
                </span>
                <span>contributed</span>
                <span className="font-bold text-[#39d353]">
                  {stats.total.toLocaleString()}
                </span>
                <span>this year on</span>
                <span className="font-semibold text-neutral-200 underline decoration-neutral-400 underline-offset-4">
                  GitHub
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

GithubCalendar.displayName = 'GithubCalendar';

export default GithubCalendar;
