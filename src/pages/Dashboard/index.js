import { useEffect, useState } from "react";
import styled from "styled-components";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import ConfirmModal from "../../components/ConfirmModal/index";
import Codes from "./Sections/Codes/index";
import BinCodes from "./Sections/BinCodes/index";
import BinNotes from "./Sections/BinNotes/index";
import Users from "./Sections/Users/index";
import Notes from "./Sections/Notes/index";
import Notify from "../../components/Notify/index"
import Logout from "../../utils/logout";
import Roles from "./Sections/Roles";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    max-height: 100vh;
    overflow: hidden;
    background-color: rgba(245, 246, 250, 1);
`;

const DashboardContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 2vh;
    height: 88vh;
    overflow-y: auto;
    max-width: 100%;
`

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("");
  const [activeSideBar, setActiveSideBar] = useState(true);
  const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    document.title = "Eliza | Dashboard";
  }, []);

  const handleLogout = () => {
    Logout(setModalLoading);
  }

  useEffect(() => {
    const currentSection = localStorage.getItem("currentSection");

    if (currentSection) {
        setSelectedSection(currentSection);
    } else {
        setSelectedSection("Usuários");
    }
  }, []);

  function addNotification(message) {
    setNotifications((prev) => [
      ...prev,
      { id: Date.now(), text: message }
    ]);
  }

  const sections = {
    "Usuários": <Users addNotification={addNotification}/>,
    "Cargos": <Roles addNotification={addNotification}/>,
    "Notas": <Notes addNotification={addNotification}/>,
    "Baixas": <Codes addNotification={addNotification}/>,
    "Lixeira de Notas": <BinNotes addNotification={addNotification}/>,
    "Lixeira de Baixas": <BinCodes addNotification={addNotification}/>,
  }   

  return (
    <Container>
      <Notify notifications={notifications} setNotifications={setNotifications}/>

      <ConfirmModal modalLoading={modalLoading} text={confirmationText} isOpen={confirmationIsOpen} setIsOpen={setConfirmationIsOpen} action={handleLogout}/>

      <SideBar setSideBar={setActiveSideBar} setConfirmationText={setConfirmationText} setConfirmation={setConfirmationIsOpen} selectedSection={selectedSection} setSelectedSection={setSelectedSection} isActive={activeSideBar}/>

      <DashboardContent>
        <TopBar setSideBar={setActiveSideBar}/>

        <SectionContainer>
          {sections[selectedSection]}
        </SectionContainer>
      </DashboardContent>
    </Container>
  );
}

export default Dashboard;