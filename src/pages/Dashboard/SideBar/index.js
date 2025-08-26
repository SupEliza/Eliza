import styled from "styled-components";
import SideBarList from "./List";
import logo from "../../../assets/images/eliza2.jpeg";
import { useEffect, useState, useRef } from "react";

const SideBarContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: ${({ isActive, isMobile }) => (isActive ? (isMobile ? "15rem" : "20rem") : "0")};
    transform: ${({ isActive, isMobile }) => (isActive ? "translateX(0)" : isMobile ? "translateX(-15rem)" : "translateX(-20rem)")};
    position: relative;
    max-height: 100%;
    box-shadow: ${({ isMobile }) => (isMobile ? "0 0 10px rgba(0, 0, 0, 0.3)" : "none")};
    z-index: 100;
    transition: transform 0.3s ease-in-out, width 0.3s ease-in-out;
    background-color: rgba(255, 255, 255, 1);
    overflow-y: auto;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const IconContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    align-items: center;
`;

const SideBarIcon = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;    
    align-items: center;
    width: 100%;
    background-color: var(--background);
`;

const Logo = styled.img`
    width: 10rem;
`;

const SideBarDefaultList = [
    { name: "Usuários", svg: "Users" },
    { name: "Cargos", svg: "Roles" },
    { name: "Transferências", svg: "Transfers" },
    { name: "Notas", svg: "Notes" },
    { name: "Baixas", svg: "Codes" },
];

const SideBarSettingsList = [
    { name: "Lixeira", svg: "Bin"},
    { name: "Sair", svg: "Logout" }
];

function SideBar({ isActive, selectedSection, setSelectedSection, setConfirmation, setConfirmationText, setSideBar }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        if (isMobile) setSideBar(false);
        return () => window.removeEventListener("resize", handleResize);
    }, [isMobile, setSideBar]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isActive && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSideBar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isActive, isMobile, setSideBar]);

    const handleSelect = (name) => {
        if (name === "Sair") {
            setConfirmation(true);
            setConfirmationText("Tem certeza que deseja sair?");
            return;
        }

        setSelectedSection(name);
        localStorage.setItem("currentSection", name);
    };

    return (
        <SideBarContainer ref={sidebarRef} isMobile={isMobile} isActive={isActive} aria-hidden={!isActive}>
            <IconContainer>
                <SideBarIcon>
                    <Logo src={logo} alt="Eliza Logo"/>
                </SideBarIcon>
            </IconContainer>

            <SideBarList list={SideBarDefaultList} selectedSection={selectedSection} handleSelect={handleSelect} subtitle="PAINEL" />
            <SideBarList list={SideBarSettingsList} selectedSection={selectedSection} handleSelect={handleSelect} dividerVisible subtitle="MANUTENÇÃO"/>
        </SideBarContainer>
    );
};

export default SideBar;