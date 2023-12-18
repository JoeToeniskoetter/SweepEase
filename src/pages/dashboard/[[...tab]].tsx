import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { CustomersTab } from "~/components/customers/CustomersTab";
import { SetupCompanyForm } from "~/components/dashboard/SetupCompanyForm";
import { SidebarLayout } from "~/components/dashboard/SidebarLayout";

const dashboard = () => {
  const { data } = useSession({ required: true });
  const locked =
    data != null &&
    (data.user.company_id === "" || data?.user.company_id === null);
  const router = useRouter();
  const getComponent = () => {
    if (locked) {
      return <SetupCompanyForm />;
    }

    switch (router.query.tab) {
      case "overview":
        return <div>Overview</div>;
      case "customers":
        return <CustomersTab />;
      case "appointments":
        return <div>appointments</div>;
      case "certifications":
        return <div>certifications</div>;
      default:
        return <div>default</div>;
    }
  };
  return (
    <SidebarLayout activeTab={router.query.tab?.toString()}>
      {/* <pre>{JSON.stringify(data, null, 4)}</pre> */}
      {getComponent()}
    </SidebarLayout>
  );
};

export default dashboard;
