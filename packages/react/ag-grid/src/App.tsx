import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "./App.css";
import OnblurDemo from "./onblur";
import LightGalleryDemo from "./lightGallery/demo";
import PerformanceExample from "./performance/index";
import { LicenseManager } from "@ag-grid-enterprise/core";
LicenseManager.setLicenseKey(
  "Using_this_{AG_Grid}_Enterprise_key_{AG-058422}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Hangzhou_unify_Information_Technology_Co.,_Ltd.}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{SCM}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{SCM}_need_to_be_licensed___{SCM}_has_been_granted_a_Deployment_License_Add-on_for_{1}_Production_Environment___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{13_May_2025}____[v3]_[01]_MTc0NzA5MDgwMDAwMA==72652fdd1aaba20569363d9c90a3b771",
);

function App() {
  return (
    <>
      <PerformanceExample />
    </>
  );
}

export default App;
