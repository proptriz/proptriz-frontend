

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full page-scroll md:max-w-[650px] mx-auto" >
      {children}
    </div> 
  );
}
