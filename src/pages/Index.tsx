import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BarChart3, ArrowRight, Zap, Shield, LineChart, Loader2 } from 'lucide-react';
import logo from "/favicon.png"

const Index: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl">
                {/* <BarChart3 className="h-5 w-5 text-primary-foreground" /> */}
                <img src={logo} alt="logo" />
              </div>
              <span className="text-xl font-bold">MetricIQ</span>
            </div>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </header>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto py-20">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8">
              <Zap className="h-4 w-4" />
              Powerful analytics made simple
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Transform Your Data Into
              <span className="text-gradient block mt-2">Actionable Insights</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Monitor KPIs, visualize trends, and make data-driven decisions with our powerful,
              enterprise-grade analytics dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="xl"
                variant="gradient"
                className="gap-2"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="xl" variant="outline" onClick={() => navigate('/dashboard')}>
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need to analyze your data
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you understand your business better
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: LineChart,
                title: 'Real-time Analytics',
                description: 'Monitor your metrics in real-time with auto-refreshing dashboards and live data updates.',
              },
              {
                icon: Shield,
                title: 'Role-based Access',
                description: 'Control who sees what with granular permissions for Admin, Manager, and Viewer roles.',
              },
              {
                icon: BarChart3,
                title: 'CSV Data Import',
                description: 'Upload your CSV files and instantly visualize your data with beautiful, interactive charts.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border bg-card p-8 card-hover"
              >
                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl gradient-primary p-12 lg:p-20 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Ready to transform your data?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Join thousands of businesses making smarter decisions with MetricIQ.
              </p>
              <Button
                size="xl"
                variant="secondary"
                className="gap-2"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
                <img src={logo} alt="logo" />
              </div>
              <span className="font-semibold">MetricIQ</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MetricIQ. All rights reserved.
            </p>
          </div>
        </div>
        <div className="w-full py-12 text-center">
  <span className="text-sm font-medium tracking-wide text-primary/80">
    Developed by <span className="text-primary font-semibold">Tantragya</span>
  </span>
</div>

      </footer>
    </div>
  );
};

export default Index;
