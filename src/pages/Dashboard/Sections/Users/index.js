import { useContext, useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../../../services/users";
import ReloadPNG from "../../../../assets/images/reload.png";
import EditUserModal from "../../../../components/EditUserModal"
import styled from "styled-components";
import editPNG from "../../../../assets/images/edit.png";
import deletePNG from "../../../../assets/images/delete.png";
import SmallLoad from "../../../../components/SmallLoad";
import AddUserModal from "../../../../components/AddUserModal";
import ConfirmModal from "../../../../components/ConfirmModal";
import { Tooltip } from "react-tooltip";
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

const UsersHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem;

  @media screen and (min-width: 550px){
    gap: 0;
    padding: 0 1.2rem;
    flex-direction: row;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  border-radius: 1rem;
  font-family: "Nunito Sans";
  font-weight: bold;
  color: black;
  font-size: 1.6rem;

  @media screen and (min-width: 768px){
    font-size: 2rem;
  }
`

const UsersHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  width: 100%;

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

const UsersListContainer = styled.div`
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

const UsersListHeader = styled.div`
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

const UsersListElement = styled.div`
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

const User = styled.div`
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

function Users () {
  const { user } = useContext(AuthContext)
  const { addNotification } = useNotify();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editMemberOpen, setEditMemberOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [sortOrder, setSortOrder] = useState({ type: "", ascending: false });
  const [selectedMember, setSelectedMember] = useState("");
  const [confirmationIsOpen, setConfirmationIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [deleteUserID, setDeleteUserID] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    try {
        setLoading(true);
        const response = await getUsers();
        
        if (response.success === true) {
          const sortedList = response.users.sort((a,b) => a.id - b.id);
          setSortOrder({ type: "ID", ascending: true })
          setUsersList(sortedList);
        }

        setLoading(false);
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    document.title = "Eliza | Usuários";
    fetchUsers();
  }, []);

  function orderList(type) {
    setUsersList((prevList) => {
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
        case "Nome":
          sortedList.sort((a, b) =>
            isAscending ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username)
          );
          break;
        case "Cargo":
          sortedList.sort((a, b) =>
            isAscending ? a.user_role.localeCompare(b.user_role) : b.user_role.localeCompare(a.user_role)
          );
          break;
        default:
          return prevList;
      }

      setSortOrder({ type, ascending: isAscending });
      return [...sortedList];
    });
  }

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const openConfirmModal = (id) => {
    setConfirmationIsOpen(true);
    setDeleteUserID(id);
    setConfirmationText("Tem certeza que deseja excluir esse usuário?");
  }

  const handleDeleteMember = async () => {
    setModalLoading(true);

    const response = await deleteUser(deleteUserID)

    if (response.success === true) {
      fetchUsers();
    }

    setDeleteUserID("");
    setModalLoading(false);
    setConfirmationIsOpen(false);
    addNotification(response.message);
  }

  const handleEditMember = (member, role) => {
    if (user.user_role !== 'Manager' && role === "Admin" || role === "Manager") {
      addNotification("Você não pode editar um usuário com cargo igual ou superior ao seu.");
      return;
    }

    setSelectedRole(role);
    setSelectedMember(member);
    setEditMemberOpen(true);
  }

  const headerList = [
    { name: "ID", action: () => orderList("ID")},
    { name: "Nome", action: () => orderList("Nome")},
    { name: "Cargo", action: () => orderList("Cargo")},
    { name: "Ações"}
  ];

  return (
    <Container>
      <UsersHeader>
        <Title>
          Usuários
        </Title>

        <UsersHeaderRight>
            <p>Total: {usersList.length}</p>

            <ReloadIcon onClick={fetchUsers} src={ReloadPNG} alt="reload"/>

            <AddButton onClick={() => setAddMemberOpen(true)} type="button">Adicionar</AddButton>
        </UsersHeaderRight>
      </UsersHeader>

      <UsersListContainer>
        <UsersListHeader>
          {headerList.map((header) => (
            <UsersListElement key={header.name} isHeader>
              {header.action ? (
                <UserPointer onClick={header.action}>
                  {header.name} {sortOrder.type === header.name && (sortOrder.ascending ? "▲" : "▼")}
                </UserPointer>
              ) : (
                header.name
              )}
            </UsersListElement>
          ))}
        </UsersListHeader>

      {loading ? <SmallLoad/> : 
          usersList.length !== 0 ?
            <UserList>
              {usersList.map((user) => (
                <User key={user.id}>
                  <UsersListElement>{user.id}</UsersListElement>
                  <UsersListElement>{capitalizeFirstLetter(user.username)}</UsersListElement>
                  <UsersListElement>{user.user_role}</UsersListElement>
                  <UsersListElement>
                    <ActionIcon data-tooltip-id="remove" onClick={() => openConfirmModal(user.id)} src={deletePNG} alt="Deletar"/>
                    <ActionIcon data-tooltip-id="edit" onClick={() => handleEditMember(user.username, user.user_role)} src={editPNG} alt="Editar"/>

                    <Tooltip id="remove" place="top" content="Remover usuário"/>
                    <Tooltip id="edit" place="top" content="Editar cargo do usuário"/>
                  </UsersListElement>
                </User>
              ))}
            </UserList>
          : <p>Nenhum registro encontrado.</p>
        }
      </UsersListContainer>

      <ConfirmModal isOpen={confirmationIsOpen} setIsOpen={setConfirmationIsOpen} text={confirmationText} action={handleDeleteMember} modalLoading={modalLoading}/>

      <AddUserModal
        setIsOpen={setAddMemberOpen}
        isOpen={addMemberOpen}
        title="Adicionar usuário"
        subtitle="Por favor, preencha os campos abaixo para continuar."
        fetchUsers={fetchUsers}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      <EditUserModal
        setIsOpen={setEditMemberOpen}
        isOpen={editMemberOpen}
        title="Editar usuário"
        subtitle="Por favor, selecione o novo cargo do usuário para continuar."
        member={selectedMember}
        fetchUsers={fetchUsers}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />
    </Container>
  );
}

export default Users