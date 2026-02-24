import { PropertyType, UserSettingsType, UserTypeEnum } from "@/types";
import { generateWhatsAppLink } from "@/utils/generateWhatsappLink";
import { Call3DIcon, GmailMinimalIcon, WhatsAppMinimalIcon } from "./Icons";
import { normalizePhone } from "@/utils/normalizePhone";
import Image from "next/image";

const StickyAgentInfo = ({user, property}: {user: UserSettingsType, property: PropertyType}) => {
  
  const link = generateWhatsAppLink({
    phoneNumber: user.whatsapp || user.phone || "",
    messageTop: `Hello, I'm interested in this property: ${property.title}`,
    pageUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/property/details/${property._id}`,
    bustCache: false,
  });

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 border-t shadow-lg">
      <div className="mx-auto md:max-w-[650px] w-full px-5 py-3 flex items-center bg-white">
        
        <div
          className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden
                     border-[3px] border-[#f0a500]
                     shadow-[0_2px_12px_rgba(240,165,0,0.3)]"
        >
          <Image
            src={user?.image || "/logo.png"}
            width={56}
            height={56}
            alt="Property owner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="ml-3">
          <h2 className="text-sm font-bold">
            {user.brand || user.username}
          </h2>
          
          <p className="text-xs text-gray-500">
            {user.user_type === UserTypeEnum.Individual ? "Property owner" : user.user_type === UserTypeEnum.Agent ? "Property agent" : "Real estate company"}
          </p>
        </div>

        <div className="ml-auto">
          <div className="ml-auto p-2 rounded-lg flex space-x-3">
            {user.phone &&
              <a
                key={"call"}
                href={`tel:${normalizePhone(user.phone)}`}
                aria-label={"Call"}
                className="p-2 rounded-lg hover:bg-gray-200 transition caese-in-out card-bg"
              >
                <Call3DIcon className="text-2xl hover:scale-110 transition-transform" />
              </a>
            }

            {user.email &&
              <a
                key={"email"}
                href={`mailto:${user.email}`}
                aria-label={"Email"}
                className="p-2 rounded-lg hover:bg-gray-200 transition caese-in-out card-bg"
              >
                <GmailMinimalIcon className="text-2xl hover:scale-110 transition-transform" />
              </a>
            }

            {user.whatsapp &&
              <a
                key={"whatsapp"}
                href={link}
                aria-label={"WhatsApp"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-200 transition caese-in-out card-bg"
              >
                <WhatsAppMinimalIcon className="text-2xl hover:scale-110 transition-transform" />
              </a>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyAgentInfo;
