import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { date: "Jan", price: 1250 },
  { date: "Feb", price: 1280 },
  { date: "Mar", price: 1265 },
  { date: "Apr", price: 1310 },
  { date: "May", price: 1290 },
  { date: "Jun", price: 1345 },
  { date: "Jul", price: 1325 },
  { date: "Aug", price: 1370 },
  { date: "Sep", price: 1410 },
];

export default function StockChart() {
  return (
    <div className="h-[380px] w-full">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#9AA3A8"
            opacity={0.2}
          />

          <XAxis
            dataKey="date"
            stroke="#9AA3A8"
          />

          <YAxis
            stroke="#9AA3A8"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#1F7A63"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}