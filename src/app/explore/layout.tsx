

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full md:max-w-[650px] mx-auto" >
      {children}
    </div> 
  );
}
