import { IUser, UserSettingsType, UserTypeEnum } from "@/types";
import { ContactActions } from "./shared/buttons";

const StickyAgentInfo = ({user}: {user: UserSettingsType}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 border-t shadow-lg">
      <div className="mx-auto md:max-w-[650px] w-full px-5 py-3 flex items-center bg-white">
        <img
          src={user.image || "/logo.png"}
          alt="Agent"
          className="w-12 h-12 rounded-full"
        />

        <div className="ml-3">
          <h2 className="text-sm font-bold">
            {user.brand || user.username}
          </h2>
          <p className="text-xs text-gray-500">
            {user.user_type === UserTypeEnum.Individual ? "Property owner" : user.user_type === UserTypeEnum.Agent ? "Property agent" : "Real estate company"}
          </p>
        </div>

        <div className="ml-auto">
          <ContactActions
            phone={`+${user.phone}`}
            email={user.email}
          />
        </div>
      </div>
    </div>
  );
};

export default StickyAgentInfo;
