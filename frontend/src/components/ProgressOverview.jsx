import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const staticData = {
  week: [
    { date: "Mon", practiceSessions: 3, hoursDevoted: 2.5, peerSessions: 1 },
    { date: "Tue", practiceSessions: 2, hoursDevoted: 1.5, peerSessions: 0 },
    { date: "Wed", practiceSessions: 4, hoursDevoted: 3, peerSessions: 2 },
    { date: "Thu", practiceSessions: 3, hoursDevoted: 2, peerSessions: 1 },
    { date: "Fri", practiceSessions: 5, hoursDevoted: 4, peerSessions: 2 },
    { date: "Sat", practiceSessions: 6, hoursDevoted: 5, peerSessions: 3 },
    { date: "Sun", practiceSessions: 2, hoursDevoted: 1.5, peerSessions: 1 },
  ],
  month: [
    { date: "Week 1", practiceSessions: 20, hoursDevoted: 15, peerSessions: 8 },
    {
      date: "Week 2",
      practiceSessions: 25,
      hoursDevoted: 18,
      peerSessions: 10,
    },
    {
      date: "Week 3",
      practiceSessions: 30,
      hoursDevoted: 22,
      peerSessions: 12,
    },
    {
      date: "Week 4",
      practiceSessions: 28,
      hoursDevoted: 20,
      peerSessions: 11,
    },
  ],
  year: [
    { date: "Jan", practiceSessions: 100, hoursDevoted: 75, peerSessions: 40 },
    { date: "Feb", practiceSessions: 120, hoursDevoted: 90, peerSessions: 48 },
    { date: "Mar", practiceSessions: 140, hoursDevoted: 105, peerSessions: 56 },
    { date: "Apr", practiceSessions: 130, hoursDevoted: 98, peerSessions: 52 },
    { date: "May", practiceSessions: 150, hoursDevoted: 112, peerSessions: 60 },
    { date: "Jun", practiceSessions: 160, hoursDevoted: 120, peerSessions: 64 },
    { date: "Jul", practiceSessions: 170, hoursDevoted: 128, peerSessions: 68 },
    { date: "Aug", practiceSessions: 180, hoursDevoted: 135, peerSessions: 72 },
    { date: "Sep", practiceSessions: 190, hoursDevoted: 142, peerSessions: 76 },
    { date: "Oct", practiceSessions: 200, hoursDevoted: 150, peerSessions: 80 },
    { date: "Nov", practiceSessions: 210, hoursDevoted: 158, peerSessions: 84 },
    { date: "Dec", practiceSessions: 220, hoursDevoted: 165, peerSessions: 88 },
  ],
};

const ProgressOverview = () => {
  const [timeRange, setTimeRange] = useState("week");

  const handleRangeChange = (range) => {
    setTimeRange(range);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded border border-gray-200 bg-white p-4 shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-purple-600">
            Practice Sessions: {payload[0].value}
          </p>
          <p className="text-green-600">Hours Devoted: {payload[1].value}</p>
          <p className="text-blue-600">Peer Sessions: {payload[2].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full rounded-3xl border border-gray-300/30 bg-black p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Your Practice History
        </h2>
        <div className="flex space-x-2">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                timeRange === range
                  ? "bg-gradient-to-r from-lime-200 to-lime-400 text-black"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={staticData[timeRange]}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="#444444" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#AAAAAA" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="practiceSessions"
            stroke="#1E90FF"
            fill="rgba(30, 144, 255, 0.5)"
            name="Practice Sessions"
          />

          <Area
            yAxisId="right"
            type="monotone"
            dataKey="hoursDevoted"
            stroke="#00CFFF"
            fill="rgba(0, 207, 255, 0.5)"
            name="Hours Devoted"
          />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey="peerSessions"
            stroke="#32CD32"
            fill="rgba(50, 205, 50, 0.5)"
            name="Peer Sessions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressOverview;
