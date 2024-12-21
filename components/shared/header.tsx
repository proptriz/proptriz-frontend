
export default function Header(){
    
    return (        
        <header className="row-start-1 bg-red-200">
            <nav className="flex flex-wrap gap-5 w-100 bg-red-300">
                <a href="#!" className="text-red-400">LOGO</a>
                <div >
                    <ul className="flex items-center justify-items-center bg-red-200">
                        <li>Menu 1</li>
                        <li>Menu 2</li>
                        <li>Menu 3</li>
                    </ul>                        
                </div>
            </nav>
            
        </header>
    );
}