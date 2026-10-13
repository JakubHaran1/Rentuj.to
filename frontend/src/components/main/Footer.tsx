function Footer() {
  return (
    <footer className="mt-16 border-t border-[#c2c9d2] bg-[#e9edf2] dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex w-[min(90%,1440px)] flex-wrap justify-between gap-3 py-5 text-xs text-[#6b7280] dark:text-slate-400">
        <span>© 2026 rentuj.to.pl</span>
        <div className="flex gap-5">
          <a className="hover:text-[#2f80ed]" href="#help">
            Help
          </a>
          <a className="hover:text-[#2f80ed]" href="#safety">
            Safety
          </a>
          <a className="hover:text-[#2f80ed]" href="#privacy">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
