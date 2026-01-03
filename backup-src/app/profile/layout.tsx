

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full md:max-w-[650px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 mx-auto" >
      {children}
    </div> 
  );
}
