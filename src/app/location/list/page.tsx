import { BackButton } from "@/components/shared/buttons";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { agents, apartments } from "@/constant";
import Link from "next/link";

const LocationListPage = () => {
    
    return (
        <div className="p-6">
            <header className=" mb-6 relative">
                <BackButton />
                <h1 className="mt-10">Top Locations</h1>
                <h4 className="">Find the best recommendations place to live</h4>
            </header>
            {/* Property Card */}
            <div className="grid grid-cols-2 w-full gap-4">
                {apartments.map(((info, key)=>(
                    <Link href={'/location/details'} key={key}>
                        <VerticalCard 
                            name={''} 
                            price={0} 
                            type="" 
                            address={info.address} 
                            image={info.image} 
                            period={""} 
                            rating={0}
                            key={key}
                        />
                    </Link>
                )))}
            </div>
        </div>
    );
};

export default LocationListPage;
