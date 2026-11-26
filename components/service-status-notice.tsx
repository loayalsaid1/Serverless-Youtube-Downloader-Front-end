import { Download, Wrench } from "lucide-react"

export function ServiceStatusNotice() {
  return (
    <section
      aria-labelledby="service-status-title"
      className="animate-in fade-in zoom-in-95 duration-500 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Download className="h-6 w-6" aria-hidden="true" />
        </div>

        <p className="text-sm font-medium text-muted-foreground">A quick note from the dev</p>
        <h2 id="service-status-title" className="mt-2 text-2xl font-bold tracking-tight">
          We're down right now
        </h2>

        <div className="mt-5 space-y-4 text-left text-sm leading-6 text-muted-foreground">
          <p>
            Hi there! I'm the person behind this little YouTube downloader. YouTube has
            changed its policies and APIs <em>yet again</em>{" "}
            <span className="text-muted-foreground/70">(this feels like the thousandth time)</span>,
            so downloads aren't working at the moment.
          </p>
          <p>
            I'll be on it as soon as I can and will get things back up. Thanks for your
            patience while the backend catches up.
          </p>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
          Service status: temporarily offline
        </div>
      </div>
    </section>
  )
}
