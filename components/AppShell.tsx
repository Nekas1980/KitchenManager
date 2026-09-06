"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  ["Dashboard", "/"],
  ["Produtos", "/produtos"],
  ["Categorias", "/categorias"],
  ["Fornecedores", "/fornecedores"],
  ["Compras", "/compras"],
  ["Stock", "/stock"],
  ["Receitas", "/receitas"],
  ["Vendas", "/vendas"],
  ["Relatórios", "/relatorios"],
];

export function AppShell({ title, eyebrow = "Gestão operacional", children }: { title: string; eyebrow?: string; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>KM</span><div>KitchenManager<small>Gestão operacional</small></div></div>
        <nav>
          {navigation.map(([label, href], index) => (
            <Link className={pathname === href ? "active" : ""} href={href} key={href}>
              <i>{String(index + 1).padStart(2, "0")}</i>{label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note"><strong>Ambiente demo</strong><span>Dados exclusivamente fictícios</span></div>
      </aside>

      <section className="workspace">
        <header>
          <div><p>{eyebrow}</p><h1>{title}</h1></div>
          <div className="profile"><span>KM</span><div>Utilizador Demo<small>Administrador</small></div></div>
        </header>
        {children}
      </section>
    </main>
  );
}
