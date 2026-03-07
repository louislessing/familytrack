import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to FamilyTrack
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A comprehensive family management platform for co-parenting, guardianship, and foster care coordination
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Children Profiles</CardTitle>
            <CardDescription>
              Manage child information, medical details, and school info
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Tracking</CardTitle>
            <CardDescription>
              Track child-related expenses across multiple categories
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shared Calendar</CardTitle>
            <CardDescription>
              Coordinate custody schedules and family events
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Handover Tracking</CardTitle>
            <CardDescription>
              Log custody exchanges with time, location, and photos
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Storage</CardTitle>
            <CardDescription>
              Secure storage for court orders and medical records
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Logs</CardTitle>
            <CardDescription>
              Document all co-parent communications for legal records
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
