import { Card, CardHeader, CardContent, Grid } from '@pv/ui';

export function Dashboard() {
  const stats = [
    { title: 'Total Users', value: '1,234', change: '+12%' },
    { title: 'Active Apps', value: '8', change: '+2' },
    { title: 'API Calls', value: '45.2K', change: '+18%' },
    { title: 'Revenue', value: '$12.4K', change: '+8%' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <Grid cols={4} gap={6}>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader
              title={stat.title}
              subtitle={stat.change}
            />
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <Card>
          <CardContent>
            <p className="text-gray-600">Activity log will be displayed here...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}