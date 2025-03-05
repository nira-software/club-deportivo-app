import { Toaster } from '@/components/ui/toaster';
import { AthleteRegistrationForm } from '@/app/secure/athlete/add/athlete-registration-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="container mx-auto">
        <AthleteRegistrationForm />
        <Toaster />
      </div>
    </main>
  );
}
