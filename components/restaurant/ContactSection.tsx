"use client";

import { useLang } from "@/lib/i18n";

export default function ContactSection() {
  const { t } = useLang();
  const c = t.contact;

  const contacts = [
    { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>, label: c.phone, value: "640 57 37 81", href: "tel:+34640573781", cta: c.callNow },
    { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>, label: c.email, value: "ilcapomangia@gmail.com", href: "https://mail.google.com/mail/?view=cm&fs=1&to=ilcapomangia%40gmail.com", cta: c.sendEmail },
    { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="var(--gold)"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>, label: c.facebook, value: "IL Capo Mangia", href: "https://www.facebook.com/ILcapomangia/", cta: c.viewProfile },
    { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="var(--gold)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, label: c.whatsapp, value: "+34 640 57 37 81", href: "https://wa.me/+34640573781", cta: c.chatNow },
  ];

  return (
    <section id="contacto" className="section-padding" style={{ backgroundColor: "var(--dark-surface)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{c.tag}</span>
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>{c.title}</h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{c.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contacts.map((contact, i) => (
            <a
              key={i}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300"
              style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(200,136,58,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--dark-border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(200,136,58,0.1)" }}>{contact.icon}</div>
              <div className="text-xs tracking-wider uppercase mb-1" style={{ color: "var(--text-muted)" }}>{contact.label}</div>
              <div className="text-sm font-medium mb-2" style={{ color: "var(--cream)" }}>
                {contact.value}
              </div>
              <span className="text-xs" style={{ color: "var(--gold)" }}>{contact.cta} →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
