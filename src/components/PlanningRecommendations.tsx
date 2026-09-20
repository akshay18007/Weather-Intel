import React from 'react';
import {
  Compass,
  Shirt,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Bike,
  Car,
  Home,
  Sparkles,
  CalendarCheck,
  Check,
  Clock,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
  Umbrella,
} from 'lucide-react';
import { PlanningRecommendation } from '../types/weather';

interface PlanningRecommendationsProps {
  recommendations: PlanningRecommendation;
}

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  recommendations,
}) => {
  const {
    activityScore,
    activityRating,
    headline,
    summary,
    bestOutdoorWindow,
    outfit,
    essentialsChecklist,
    commute,
    lifestyle,
    sevenDayHighlight,
  } = recommendations;

  // Rating badge styling
  const scoreColors =
    activityScore >= 80
      ? {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          border: 'border-emerald-200 dark:border-emerald-800/80',
          text: 'text-emerald-700 dark:text-emerald-300',
          badge: 'bg-emerald-500 text-white',
          bar: 'bg-emerald-500',
        }
      : activityScore >= 60
      ? {
          bg: 'bg-sky-50 dark:bg-sky-950/40',
          border: 'border-sky-200 dark:border-sky-800/80',
          text: 'text-sky-700 dark:text-sky-300',
          badge: 'bg-sky-500 text-white',
          bar: 'bg-sky-500',
        }
      : activityScore >= 40
      ? {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border-amber-200 dark:border-amber-800/80',
          text: 'text-amber-700 dark:text-amber-300',
          badge: 'bg-amber-500 text-white',
          bar: 'bg-amber-500',
        }
      : {
          bg: 'bg-rose-50 dark:bg-rose-950/40',
          border: 'border-rose-200 dark:border-rose-800/80',
          text: 'text-rose-700 dark:text-rose-300',
          badge: 'bg-rose-500 text-white',
          bar: 'bg-rose-500',
        };

  return (
    <div className="space-y-6">
      {/* 1. Main Score & Recommendation Banner */}
      <div className={`rounded-2xl p-6 sm:p-7 border ${scoreColors.border} ${scoreColors.bg} shadow-xs relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${scoreColors.badge}`}>
                {activityRating} • {activityScore}/100 Score
              </span>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Planning Intelligence
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {headline}
            </h3>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 max-w-3xl leading-relaxed">
              {summary}
            </p>

            {/* Best Window Pill */}
            <div className="pt-2 flex items-center gap-2 text-xs font-medium text-zinc-800 dark:text-zinc-200">
              <Clock className="w-4 h-4 text-sky-500 shrink-0" />
              <span>
                <strong>Best Outdoor Window:</strong> {bestOutdoorWindow}
              </span>
            </div>
          </div>

          {/* Activity Score Circular / Gauge Visual */}
          <div className="shrink-0 flex sm:flex-col items-center justify-center p-4 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 text-center min-w-[140px]">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Activity Index</span>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 my-0.5">
              {activityScore}
              <span className="text-sm font-normal text-zinc-400">/100</span>
            </div>
            <span className={`text-xs font-semibold ${scoreColors.text}`}>
              {activityRating}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Grid of Planning Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card A: Outfit & Layering Advisory */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Shirt className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  Outfit & Layering Advisory
                </h4>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] block mb-0.5">Top & Base Layer</span>
                <p className="text-zinc-800 dark:text-zinc-200 font-medium">{outfit.top}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] block mb-0.5">Bottom</span>
                <p className="text-zinc-800 dark:text-zinc-200 font-medium">{outfit.bottom}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] block mb-0.5">Outerwear / Shell</span>
                <p className="text-zinc-800 dark:text-zinc-200 font-medium">{outfit.outerwear}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-500 uppercase tracking-wider text-[10px] block mb-0.5">Footwear</span>
                <p className="text-zinc-800 dark:text-zinc-200 font-medium">{outfit.footwear}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800 italic">
            &quot;{outfit.summary}&quot;
          </p>
        </div>

        {/* Card B: Daily Essentials Checklist */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  Daily Gear Checklist
                </h4>
              </div>
            </div>

            <div className="space-y-3">
              {essentialsChecklist.map((gear) => {
                const badgeStyle =
                  gear.status === 'required'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                    : gear.status === 'recommended'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : gear.status === 'optional'
                    ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';

                return (
                  <div
                    key={gear.id}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-start gap-3"
                  >
                    <div className="mt-0.5 p-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                      {gear.id === 'umbrella' ? (
                        <Umbrella className="w-4 h-4 text-sky-500" />
                      ) : gear.id === 'sun_protection' ? (
                        <Sun className="w-4 h-4 text-amber-500" />
                      ) : gear.id === 'windbreaker' ? (
                        <Wind className="w-4 h-4 text-teal-500" />
                      ) : (
                        <Droplets className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {gear.item}
                        </span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded-full border ${badgeStyle}`}>
                          {gear.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
                        {gear.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-xs text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            Calculated dynamically against Open-Meteo precipitation thresholds and UV index.
          </p>
        </div>

        {/* Card C: Commute & Transit Conditions */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                <Car className="w-4 h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Commute & Transit Conditions
              </h4>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              Road: {commute.roadCondition}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <Footprints className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-0.5">Walking & Pedestrian</span>
                <p className="text-zinc-600 dark:text-zinc-400">{commute.walking}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <Bike className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-0.5">Cycling & Micromobility</span>
                <p className="text-zinc-600 dark:text-zinc-400">{commute.cycling}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <Car className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-0.5">Driving & Highways</span>
                <p className="text-zinc-600 dark:text-zinc-400">{commute.driving}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card D: Home & Living + Week's Best Day */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Home className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  Home Living & 7-Day Pick
                </h4>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-0.5">Outdoor Laundry Drying</span>
                <p className="text-zinc-600 dark:text-zinc-400">{lifestyle.laundryDrying}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-0.5">Ventilation & Fresh Air</span>
                <p className="text-zinc-600 dark:text-zinc-400">{lifestyle.airQualityOrVentilation}</p>
              </div>
            </div>
          </div>

          {/* 7-Day Planning Highlight */}
          <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-200/80 dark:border-sky-800/60">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-semibold text-xs mb-1">
              <CalendarCheck className="w-4 h-4 text-sky-500" />
              <span>Optimal Day of the Week: {sevenDayHighlight.bestDay}</span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">
              {sevenDayHighlight.highlight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
