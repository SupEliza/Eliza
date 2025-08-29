import { useContext, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { deleteRole, getRoles } from "../../../../services/roles";
import ReloadPNG from "../../../../assets/images/reload.png";
import styled from "styled-components";
import editPNG from "../../../../assets/images/edit.png";
import deletePNG from "../../../../assets/images/delete.png";
import SmallLoad from "../../../../components/SmallLoad";
import ConfirmModal from "../../../../components/ConfirmModal";
import AddRoleModal from "../../../../components/AddRoleModal";
import EditRoleModal from "../../../../components/EditRoleModal";
import TotalContainer from "../../../../components/TotalContainer";
import { AuthContext } from "../../../../hooks/Authentication/authContext";
import { useNotify } from "../../../../hooks/Notify/notifyContext";
                                                                                                                                                                                                                                                                                                                                                                                                                     
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 1rem;
  min-height: 100%;
`;

const RolesHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem;

  @media screen and (min-width: 550px){
    gap: 0;
    padding: 0 1.2rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
`

const RolesHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  height: 100%; 

  @media screen and (min-width: 350px){
    flex-direction: row;
    justify-content: space-evenly;  
  }

  @media screen and (min-width: 550px){
    gap: 1rem;
    width: unset;
  }
`;

const ReloadIcon = styled.img`
  width: 3rem;
  cursor: pointer;
  transition: all 0.5s ease-in-out;

  &:hover{
    transform: rotate(360deg);
  }
`;

const RolesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  overflow: hidden;
  gap: .5rem;
  text-align: center;
  height: 100%;
  width: 100%;
  border: 1px solid rgba(11, 35, 97, 0.3);
`;

const AddButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: var(--background);
  color: var(--secondary-color);
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
`;

const RolesListHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  background-color: var(--background); 
  color: var(--secondary-color);
  border-radius: 0.5rem;
  font-weight: bold;
  padding: .5rem;
  margin: .2rem;
  width: 100%;
`;

const RolesListElement = styled.div`
  display: ${({ type, isMobile }) => (type === "ID" ? (isMobile ? "none" : "flex") : "flex")};
  gap: .2rem;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: "Nunito Sans";
  font-size: ${({isHeader}) => (isHeader ? ".8rem" : ".6rem")};
  box-sizing: border-box;
  text-align: center;
  border-radius: 0.5rem;
  margin: 0.5rem;
  width: ${(props) => props.width || "20%"};
  
  @media screen and (min-width: 768px){
    gap: 1rem;
    font-size: 1rem;
  }
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  max-height: 100%;
  width: 100%;

  &::-webkit-scrollbar {
      width: 2px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent; 
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--background);
    border-radius: 5px;
  }
`;

const UserPointer = styled.p`
  cursor: pointer;
`;

const Role = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  background-color: #FAFAFA;
  border-radius: 0.5rem;
  padding: .5rem;
  margin: .2rem;
  width: 100%;
`;

const ActionIcon = styled.img`
  width: 1rem;
  cursor: pointer;

  @media screen and (min-width: 768px){
    width: 2rem;
  }
`;

function Roles () {
  const { user } = useContext(AuthContext);
  const { addNotification } = useNotify();
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState({ type: "", ascending: false });
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [roleID, setRoleID] = useState("");
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchRoles() {
    setLoading(true);
    try {
        const response = await getRoles();
        
        if (response.success) {
          const sortedList = response.roles.sort((a,b) => a.id - b.id);
          setSortOrder({ type: "ID", ascending: true })
          setRolesList(sortedList);
        }
    } catch (error) {
        console.error(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    document.title = "Eliza | Cargos";
    fetchRoles();
  }, []);

  function orderList(type) {
    setRolesList((prevList) => {
      let sortedList = [...prevList];
      const isAscending = sortOrder.type === type ? !sortOrder.ascending : true;

      switch (type) {
        case "ID":
          sortedList.sort((a, b) =>
            isAscending
              ? a.id - b.id
              : b.id - a.id
          );
          break;
        case "Cargo":
          sortedList.sort((a, b) =>
            isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
          );
          break;
        default:
          return prevList;
      }

      setSortOrder({ type, ascending: isAscending });
      return [...sortedList];
    });
  }

  async function handleDeleteRole() {
    setModalLoading(true);
    try {
      const response = await deleteRole(roleID);

      if (response.success) {
        fetchRoles();
      }

      setConfirmDeleteOpen(false);
      addNotification(response.message);
    } catch (error) {
      console.log(error);
    }
    setModalLoading(false);
  }

  function openConfirmDelete(id) {
    setConfirmDeleteOpen(true);
    setRoleID(id);
    setConfirmationText("Tem certeza que deseja deletar esse cargo?");
  }

  function handleEditRole(role, permissions){
    if (user.user_role !== 'Moderador' && (role === "Admin" || role === "Moderador")) {
      addNotification("Você não pode editar esse cargo.");
      return;
    }

    setSelectedPerms(permissions);
    setSelectedRole(role);
    setEditRoleOpen(true);
  }

  const headerList = [
    { name: "ID", action: () => orderList("ID")},
    { name: "Cargo", action: () => orderList("Cargo")},
    { name: "Permissões"},
    { name: "Ações"}
  ];

  return (
    <Container>
      <RolesHeader>
        <HeaderLeft>
          <TotalContainer loading={loading} total={rolesList.length} />
        </HeaderLeft>

        <RolesHeaderRight>
            <AddButton onClick={() => setAddRoleOpen(true)} type="button">Adicionar</AddButton>
            <ReloadIcon onClick={fetchRoles} src={ReloadPNG} alt="reload"/>
        </RolesHeaderRight>
      </RolesHeader>

      <RolesListContainer>
        <RolesListHeader>
          {headerList.map((header) => (
            <RolesListElement key={header.name} isHeader>
              {header.action ? (
                <UserPointer onClick={header.action}>
                  {header.name} {sortOrder.type === header.name && (sortOrder.ascending ? "▲" : "▼")}
                </UserPointer>
              ) : (
                header.name
              )}
            </RolesListElement>
          ))}
        </RolesListHeader>

      {loading ? <SmallLoad/> : 
          rolesList.length !== 0 ?
            <UserList>
              {rolesList.map((role, index) => (
                <Role key={index}>
                  <RolesListElement>{role.id}</RolesListElement>
                  <RolesListElement>{role.name}</RolesListElement>
                  <RolesListElement>{role.permissions.join(", ")}</RolesListElement>
                  <RolesListElement>
                    <ActionIcon data-tooltip-id="remove" onClick={() => openConfirmDelete(role.id)} src={deletePNG} alt="Deletar"/>
                    <ActionIcon data-tooltip-id="edit" onClick={() => handleEditRole(role.name, role.permissions)} src={editPNG} alt="Editar"/>

                    <Tooltip id="remove" place="top" content="Excluir cargo"/>
                    <Tooltip id="edit" place="top" content="Editar permissões"/>
                  </RolesListElement>
                </Role>
              ))}
            </UserList>
          : <p>Nenhum registro encontrado.</p>
        }
      </RolesListContainer>

      <ConfirmModal isOpen={confirmDeleteOpen} setIsOpen={setConfirmDeleteOpen} text={confirmationText} action={handleDeleteRole} modalLoading={modalLoading}/>

      <AddRoleModal
        isOpen={addRoleOpen}
        setIsOpen={setAddRoleOpen}
        title={"Adicionar cargo"}
        selectedPerms={selectedPerms}
        setSelectedPerms={setSelectedPerms}
        fetchRoles={fetchRoles}
      />

      <EditRoleModal
        isOpen={editRoleOpen}
        setIsOpen={setEditRoleOpen}
        title={"Editar cargo"}
        selectedPerms={selectedPerms}
        selectedRole={selectedRole}
        setSelectedPerms={setSelectedPerms}
        fetchRoles={fetchRoles}
      />

    </Container>
  );
}

export default Roles