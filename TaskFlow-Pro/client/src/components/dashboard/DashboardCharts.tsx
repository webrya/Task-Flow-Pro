import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { type Booking, type Task } from "@shared/schema";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, subDays } from 'date-fns';

export function DashboardCharts({ properties }: { properties: any[] }) {
  const { t } = useI18n();
  
  // Fetch all bookings for all properties to show overall growth
  const bookingsQueries = properties.map(p => useQuery<Booking[]>({
    queryKey: [api.bookings.list.path, p.id],
    enabled: !!p.id,
  }));

  const tasksQueries = properties.map(p => useQuery<Task[]>({
    queryKey: [api.tasks.list.path, p.id],
    enabled: !!p.id,
  }));

  const allBookings = bookingsQueries.flatMap(q => q.data || []);
  const allTasks = tasksQueries.flatMap(q => q.data || []);

  // Prepare line chart data (bookings over last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const dayStr = format(date, 'MMM dd');
    const count = allBookings.filter(b => {
      const bDate = new Date(b.startDate);
      return format(bDate, 'MMM dd') === dayStr;
    }).length;
    return { name: dayStr, bookings: count };
  });

  // Prepare pie chart data (tasks)
  const taskStats = [
    { name: t('tasks.open'), value: allTasks.filter(t => t.status === 'open').length, color: '#f59e0b' },
    { name: t('tasks.inProgress'), value: allTasks.filter(t => t.status === 'in_progress').length, color: '#3b82f6' },
    { name: t('tasks.done'), value: allTasks.filter(t => t.status === 'completed').length, color: '#10b981' },
  ].filter(s => s.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg font-display">{t('dashboard.bookingGrowth')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last30Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-lg font-display">{t('dashboard.taskStatus')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6 h-[300px]">
          {taskStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
              No task data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
