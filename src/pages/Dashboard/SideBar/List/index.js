import styled from "styled-components";

import { ReactComponent as CodesSVG } from "../../../../assets/svg/codes.svg";
import { ReactComponent as UsersSVG } from "../../../../assets/svg/users.svg";
import { ReactComponent as NotesSVG } from "../../../../assets/svg/notes.svg";
import { ReactComponent as RolesSVG } from "../../../../assets/svg/roles.svg";
import { ReactComponent as BinSVG } from "../../../../assets/svg/bin.svg";
import { ReactComponent as LogoutSVG } from "../../../../assets/svg/logout.svg";

const SideBarItemsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Subtitle = styled.div`
    display: ${(props) => props.subtitle ? "flex" : "none"};
    color: #202224;
    font-family: "Nunito Sans";
    font-size: .9rem;
    margin: 1rem 0;
    padding: 0 2.5rem;
    font-weight: 700;
`

const Divider = styled.div`
    display: ${(props) => (props.dividerVisible ? "block" : "none")};
    width: 100%;
    height: 1px;
    margin: 1rem 0;
    background-color: rgba(224, 224, 224, 1);
    opacity: ${(props) => (props.dividerVisible ? "1" : "0")};
`;

const SideBarItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;    
    align-items: center;
    font-family: "Nunito Sans", sans-serif;
    color: black;
    font-size: 1rem;
`;

const SideBarItemButton = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 1.5rem;
    width: 65%;
    padding: 1.2rem;
    gap: 1rem;
    border-radius: .5rem;
    transition: all 0.3s ease-in-out;
    color: var(--secondary-color);
    background-color: var(--dashboard-secondary-color);

    &:hover{
        cursor: pointer;
    }
`;

const Selected = styled.div`
    position: absolute;
    left: 0;
    height: 1.5rem;
    width: 0.4rem;
    border-radius: 0 .5rem .5rem 0;
    padding: 1rem 0;
    background-color: var(--background);
    transition: all 0.3s ease-in-out;
`;

const sideBarIcons = {
    Codes: CodesSVG,
    Bin: BinSVG,
    Users: UsersSVG,
    Notes: NotesSVG,
    Roles: RolesSVG,
    Logout: LogoutSVG,
};

function SideBarList({list, selectedSection, handleSelect, dividerVisible, subtitle}){
    return(
        <SideBarItemsContainer> 
            <Divider dividerVisible={dividerVisible}/>

            <Subtitle subtitle={subtitle}>{subtitle ? subtitle : ""}</Subtitle>

            {list.map((item) => {

                const Icons = sideBarIcons[item.svg ? item.svg : item.name];
                
                return(
                    <SideBarItem key={item.name}>
                        <Selected style={{ transform: selectedSection === item.name ? "translateX(0)" : "translateX(-0.4rem)" }}></Selected>

                        <SideBarItemButton onClick={() => handleSelect(item.name)} style={{ backgroundColor: selectedSection === item.name ? "var(--background" : "var(--secondary-color)", 
                            color: selectedSection === item.name ? "var(--secondary-color" : "black"}}> 

                            {Icons && <Icons style={{ fill: selectedSection === item.name ? "var(--secondary-color)" : "var(--background)", transition: "all .3s ease-in-out"}}/>}

                            <p>{item.name}</p>
                        </SideBarItemButton>
                    </SideBarItem>
                );
                
            })}
        </SideBarItemsContainer>
    )
}

export default SideBarList;