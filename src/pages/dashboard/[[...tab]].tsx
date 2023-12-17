import { useRouter } from "next/router";
import { CustomersTab } from "~/components/customers/CustomersTab";
import { CustomersTable } from "~/components/customers/CustomersTable";
import { SidebarLayout } from "~/components/dashboard/SidebarLayout";

const dashboard: React.FC = ({}) => {
  const router = useRouter();
  const getComponent = () => {
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
    <SidebarLayout activeTab={router.query.tab}>{getComponent()}</SidebarLayout>
  );
};

export default dashboard;
