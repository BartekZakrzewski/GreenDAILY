"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
} from "./card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart"

export const description = "A donut chart with text"

const chartData = [
  { EcoScore: "Score to get", Score: 10, fill: "#ffffff00" },
  { EcoScore: "Score", Score: 90, fill: "rgb(20 83 45)" },
]

const chartConfig = {
    chrome: {
        label: "Score to get",
        color: "#ffffff00",
    },
    safari: {
        label: "Score",
        color: "rgb(20 83 45)",
    },
} satisfies ChartConfig

export default function EcoScore() {

  return (
    <Card className="flex flex-col w-full">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="Score"
              nameKey="EcoScore"
              innerRadius={70}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          EcoScore
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="text-slate-900 text-base"
                        >
                          90%
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
