"use client";

import { useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { person } from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type Fields = { name: string; email: string; subject: string; message: string };
type Status = "idle" | "sending" | "sent" | "mailto" | "error";

const empty: Fields = { name: "", email: "", subject: "", message: "" };

function validate(values: Fields): Partial<Fields> {
  const errors: Partial<Fields> = {};
  if (values.name.trim().length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (values.subject.trim().length < 3) errors.subject = "Add a short subject.";
  if (values.message.trim().length < 10) errors.message = "Write at least a sentence.";
  return errors;
}

const inputClass =
  "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function Contact() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [company, setCompany] = useState(""); // honeypot

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const mailto = `mailto:${person.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(
    `${values.message}\n\n${values.name}\n${values.email}`,
  )}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, company }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("sent");
        setValues(empty);
      } else if (data.fallback === "mailto") {
        setStatus("mailto");
        window.location.href = mailto;
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const field = (key: keyof Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`contact-${key}`} className="text-sm font-medium">{label}</label>
      <input
        id={`contact-${key}`}
        name={key}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
        className={cn(inputClass, errors[key] ? "border-red-500" : "border-line")}
        {...props}
      />
      {errors[key] && <p id={`contact-${key}-error`} className="mt-1.5 text-sm text-red-600">{errors[key]}</p>}
    </div>
  );

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <h2 id="contact-title" className="font-display text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[3.4rem]">
            Interested in working together?
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            I am looking for a Werkstudent role in Germany where data and web engineering meet. Write to me and I will get back to you.
          </p>

          <ul className="mt-9 space-y-4 text-[1.02rem]">
            <li>
              <a href={`mailto:${person.email}`} className="inline-flex items-center gap-3 break-all underline-offset-4 hover:underline">
                <Mail className="size-5 shrink-0 text-accent" aria-hidden="true" />
                {person.email}
              </a>
            </li>
            <li>
              <a href={person.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 underline-offset-4 hover:underline">
                <LinkedInIcon className="size-5 shrink-0 text-accent" />
                linkedin.com/in/priyankabhorkar
              </a>
            </li>
            <li>
              <a href={person.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 underline-offset-4 hover:underline">
                <GitHubIcon className="size-5 shrink-0 text-accent" />
                github.com/PriyankaBhorkar
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="size-5 shrink-0 text-accent" aria-hidden="true" />
              {person.location}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              {field("name", "Name", { autoComplete: "name", placeholder: "Your name" })}
              {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "you@company.com" })}
            </div>
            <div className="mt-5">{field("subject", "Subject", { placeholder: "What is this about?" })}</div>
            <div className="mt-5">
              <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={set("message")}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                placeholder="Tell me about the role or project."
                className={cn(inputClass, "resize-y", errors.message ? "border-red-500" : "border-line")}
              />
              {errors.message && <p id="contact-message-error" className="mt-1.5 text-sm text-red-600">{errors.message}</p>}
            </div>

            {/* Hidden from people, tempting for bots. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={status === "sending"} className="px-7 py-3">
                {status === "sending" ? "Sending…" : "Send message"}
              </Button>
              <p role="status" aria-live="polite" className="text-[0.95rem] text-muted">
                {status === "sent" && "Message sent. Thank you, I will reply soon."}
                {status === "mailto" && (
                  <>Your email app should open with the message ready. If it does not, <a className="text-accent-deep underline" href={mailto}>open it here</a>.</>
                )}
                {status === "error" && (
                  <>The message could not be sent. Email me directly at <a className="text-accent-deep underline" href={`mailto:${person.email}`}>{person.email}</a>.</>
                )}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
