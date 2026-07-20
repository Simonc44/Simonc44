import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Linkedin, Instagram, Github, MapPin, Copy, Check, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FadeIn } from "@/components/animations/FadeIn";

// Stay safely under the ~2000-char mailto URI limit after encodeURIComponent (~×1.5).
const MAX_BODY_CHARS = 1200;

const CONTACT_EMAIL = "simon.chusseau@gmail.com"; // Replace with your real address

const socials = [
  {
    name: "LinkedIn",
    handle: "simon-chusseau",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/simon-chusseau-91541a378/",
    color: "hover:border-blue-500/40 hover:bg-blue-500/5",
    iconColor: "group-hover:text-blue-400",
  },
  {
    name: "GitHub",
    handle: "Simonc44",
    icon: Github,
    url: "https://github.com/Simonc44",
    color: "hover:border-purple-500/40 hover:bg-purple-500/5",
    iconColor: "group-hover:text-purple-400",
  },
  {
    name: "Instagram",
    handle: "simonchusseau",
    icon: Instagram,
    url: "https://www.instagram.com/simonchusseau/",
    color: "hover:border-pink-500/40 hover:bg-pink-500/5",
    iconColor: "group-hover:text-pink-400",
  },
];

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(120),
  // Keep the raw message length aligned with the `MAX_BODY_CHARS` budget so we
  // don't validate a 1500-char message that gets silently truncated to ~1100.
  message: z.string().min(10, "Message must be at least 10 characters").max(1100),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      toast({
        title: "Email copied",
        description: `${CONTACT_EMAIL} is on your clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Could not copy",
        description: "Please copy manually: " + CONTACT_EMAIL,
        variant: "destructive",
      });
    }
  };

  const onSubmit = handleSubmit((values) => {
    // Compose a mailto link with the form payload. Keep raw body short so the
    // encoded URI stays under the ~2000-char limit on Gmail / Outlook.
    const subject = encodeURIComponent(`[Portfolio] ${values.subject}`);
    const suffix = `\n\n— ${values.name}\n${values.email}`;
    const budget = MAX_BODY_CHARS - suffix.length - `Hi Simon,\n\n`.length;
    const mainMessage =
      values.message.length > Math.max(0, budget)
        ? `${values.message.slice(0, Math.max(0, budget - 1))}…`
        : values.message;
    const bodyText = `Hi Simon,\n\n${mainMessage}${suffix}`;
    const body = encodeURIComponent(bodyText);
    const href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    // Best-effort: open the user's mail client.
    window.location.href = href;

    toast({
      title: "Opening your mail client…",
      description: "If nothing happened, copy the email and write me directly.",
    });

    reset();
  });

  return (
    <section id="contact" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <FadeIn>
            <p className="text-sm font-mono text-primary/70 tracking-widest uppercase">Say hello</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-medium">
              Let's <span className="text-gradient">Connect</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground">
              Always open to new projects, creative ideas, or a good conversation about what we're
              building.
            </p>
          </FadeIn>
        </div>

        {/* Socials */}
        <FadeIn delay={0.3}>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-4 p-5 rounded-2xl bg-gradient-card backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 ${social.color}`}
                  aria-label={`${social.name} (@${social.handle})`}
                >
                  <div className="p-2.5 rounded-xl bg-card/60 border border-primary/10">
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${social.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{social.name}</p>
                    <p className="text-xs text-muted-foreground">@{social.handle}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Email card */}
          <FadeIn delay={0.35} className="lg:col-span-2">
            <div className="h-full bg-gradient-card backdrop-blur-sm rounded-2xl p-8 border border-primary/10 text-center space-y-5 flex flex-col justify-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>France — working remotely worldwide</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Prefer email?</h3>
              <p className="text-muted-foreground text-sm">
                Click to copy or open your mail client.
              </p>
              <div className="flex flex-col gap-2">
                <code className="font-mono text-sm bg-background/60 border border-border/60 rounded-lg px-3 py-2 select-all">
                  {CONTACT_EMAIL}
                </code>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-primary/40 hover:bg-primary/10"
                    onClick={onCopyEmail}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    asChild
                  >
                    <a href={`mailto:${CONTACT_EMAIL}`}>
                      <Mail className="w-4 h-4" />
                      Open
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Contact form */}
          <FadeIn delay={0.4} className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              noValidate
              className="bg-gradient-card backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-primary/10 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  aria-invalid={!!errors.subject}
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="text-xs text-red-400">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me about your project, idea, or question…"
                  aria-invalid={!!errors.message}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red-400">{errors.message.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-xs text-muted-foreground">
                  Submitting opens your mail client with the message pre-filled.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Contact;
