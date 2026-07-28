export default function OfflinePage() {
  return (
    <main className="container py-16">
      <h1 className="text-3xl font-bold">EduArtha is offline</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Previously opened pages can still load through the browser cache. AI explanations need an internet connection.
      </p>
    </main>
  );
}
