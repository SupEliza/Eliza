import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import SmallLoad from "../../../../components/SmallLoad";
import reloadPNG from "../../../../assets/images/reload.png";
import styled from "styled-components";
import TotalContainer from "../../../../components/TotalContainer";
import { getPrints } from "../../../../services/prints";
import { ReactComponent as PrinterSVG } from "../../../../assets/svg/search.svg";
import NewPlateModal from "../../../../components/NewPlateModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  gap: 1rem;
  min-height: 100%;
`;

const PlatesHeader = styled.div`
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

const PlatesHeaderRight = styled.div`
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

const PrinterIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background);
  border-radius: 100%;
  width: 3rem;
  height: 3rem;
  cursor: pointer;

  & svg{
    fill: var(--secondary-color);
    width: 1.5rem;
    height: 1.5rem;
  }
`

const ReloadIcon = styled.img`
  width: 3rem;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
`;

const PlatesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  overflow: hidden;
  border: 1px solid rgba(11, 35, 97, 0.3);
  gap: .5rem;
  height: 100%;
  width: 100%; 
`;

const PlatesListHeader = styled.div`
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
  width: 100%;
`;

const PlatesListElement = styled.div`
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

const PlatePointer = styled.p`
  cursor: pointer;
`;

const PlatesList = styled.div`
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

const Plate = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  box-sizing: border-box;
  background-color: #FAFAFA;
  border-radius: 0.5rem;
  padding: .5rem;
  margin: .2rem 0;
  width: 100%;
`;

const LoadMoreButton = styled.button`
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
  margin: 1rem;
  padding: 1rem;
  min-width: 8rem;
  cursor: pointer;
`;

function Plates () {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sortOrder, setSortOrder] = useState({ type: "", ascending: false });
  const [totalPrints, setTotalPrints] = useState(0);
  const [platesLimit, setplatesLimit] = useState(10);
  const [platesList, setPlatesList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  async function fetchPlates(append = false) {
    try {
      setLoading(true);
      const response = await getPrints(platesLimit);
  
      if (response.success) {
        setTotalPrints(response.total);

        setPlatesList((prevList) => {
          return append ? [...prevList, ...response.prints] : response.prints;
        });

      } else{
        setPlatesList([]);
        setTotalPrints(0);
      }
  
      setSortOrder({ type: "Data/Hora", ascending: false });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    document.title = "Eliza | Placas";
    fetchPlates();
  }, [platesLimit]);

  function orderList(type) {
    setPlatesList((prevList) => {
      let sortedList = [...prevList];
      const isAscending = sortOrder.type === type ? !sortOrder.ascending : true;

      switch (type) {
        case "Usuário":
          sortedList.sort((a, b) =>
            isAscending ? a.user_add.localeCompare(b.user_add) : b.user_add.localeCompare(a.user_add)
          );
          break;
        case "Data/Hora":
          sortedList.sort((a, b) =>
            isAscending
              ? new Date(a.created_at) - new Date(b.created_at)
              : new Date(b.created_at) - new Date(a.created_at)
          );
          break;
        case "Descrição":
          sortedList.sort((a, b) =>
            isAscending ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description)
          );
          break;
        case "Tipo":
          sortedList.sort((a, b) =>
            isAscending ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)
          );
          break;
        case "Preço":
          sortedList.sort((a, b) =>
            isAscending ? a.price - b.price : b.price - a.price
          );
          break;
        default:
          return prevList;
      }
      setSortOrder({ type, ascending: isAscending });
      return [...sortedList];
    });
  }

  function handleReloadPlates() {
    setplatesLimit(10);
    fetchPlates(false);
  }

  function handleLoadMore() {
    setplatesLimit((prev) => prev + 10);
    fetchPlates(true);
  }

  const headerList = [
    { name: "Usuário", action: () => orderList("Usuário") },
    { name: "Descrição", action: () => orderList("Descrição") },
    { name: "Preço", action: () => orderList("Preço") },
    { name: "Tipo", action: () => orderList("Tipo") },
    { name: "Data/Hora", action: () => orderList("Data/Hora") },
  ];

  function capitalizeFirstLetter(str) {
    if (!str) return "";
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Container>
      <PlatesHeader>
        <HeaderLeft>
          <TotalContainer loading={loading} total={totalPrints} />
        </HeaderLeft>

        <PlatesHeaderRight>
          <PrinterIconContainer onClick={() => setShowAddModal(true)} data-tooltip-id="print">
            <PrinterSVG/>
          </PrinterIconContainer>
          <ReloadIcon onClick={handleReloadPlates} src={reloadPNG} data-tooltip-id="reload"/>

          <Tooltip id="print" place="top" content="Buscar Produto"/>
          <Tooltip id="reload" place="top" content="Recarregar lista"/>
        </PlatesHeaderRight>
      </PlatesHeader>
      
      <PlatesListContainer>
        <PlatesListHeader>
          {headerList.map((header) => (
            <PlatesListElement key={header.name} isHeader>
              {header.action ? (
                <PlatePointer onClick={header.action}>
                  {header.name} {sortOrder.type === header.name && (sortOrder.ascending ? "▲" : "▼")}
                </PlatePointer>
              ) : (
                header.name
              )}
            </PlatesListElement>
          ))}
        </PlatesListHeader>

        {loading ? <SmallLoad/> : 
          platesList.length !== 0 ?
            <PlatesList>
              {platesList.map((plate) => (
                <Plate key={`${plate.id}-${plate.created_at}`}>
                    <PlatesListElement>{capitalizeFirstLetter(plate.user_add)}</PlatesListElement>
                    
                    <PlatesListElement>{plate.description}</PlatesListElement>

                    <PlatesListElement>
                        {plate.price}
                    </PlatesListElement>

                    <PlatesListElement>{plate.type}</PlatesListElement>

                    <PlatesListElement>
                        {new Date(plate.created_at).toLocaleString("pt-BR", {
                            timeZone: "America/Sao_Paulo",
                            dateStyle: "short",
                            timeStyle: "short"
                        })}
                    </PlatesListElement>
                </Plate>
              ))}

              {platesLimit < totalPrints && (
                <PlatesListElement>
                  <LoadMoreButton onClick={handleLoadMore}>Carregar mais</LoadMoreButton>
                </PlatesListElement>
              )}
            </PlatesList>
          : <p>Nenhum registro encontrado.</p>
        }
      </PlatesListContainer>

      {showAddModal && <NewPlateModal fetchPlates={fetchPlates} isOpen={showAddModal} setIsOpen={setShowAddModal} title="Buscar Produto"/>}
    </Container>
  );
}

export default Plates