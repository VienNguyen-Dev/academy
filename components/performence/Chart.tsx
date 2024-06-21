"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Card } from "../ui/card";

const Chart = ({ data }: { data: { name: string; total: number }[] }) => {
  return (
    <Card>
      <ResponsiveContainer width={"100%"} height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="888888" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis dataKey="name" stroke="888888" fontSize={12} axisLine={false} tickLine={false} tickFormatter={(value) => `${{ value }}`} />
          <Bar dataKey="total" barSize={30} fill="#8884d8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default Chart;
