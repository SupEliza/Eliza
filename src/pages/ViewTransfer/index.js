import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTransfersById } from "../../services/transfers";
import { ReactComponent as CheckSVG } from "../../assets/svg/check.svg";
import { ReactComponent as ExportSVG } from "../../assets/svg/export.svg";
import { Tooltip } from "react-tooltip";
import { useNotify } from "../../hooks/Notify/notifyContext";
import styled from "styled-components";
import SmallLoad from "../../components/SmallLoad";


const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 1rem;
    min-height: 100vh;
    background-color: ${(props) => props.backgroundColor || "rgba(245, 246, 250, 1)"};
    font-family: 'Nunito Sans', sans-serif;

    @media screen and (min-width: 1000px){
        padding: 0;
        min-height: unset;
        height: 100vh;
    }
`;

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    gap: 1rem;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgba(245, 246, 250, 1);
    font-family: 'Nunito Sans', sans-serif;

    @media screen and (min-width: 1000px){
        flex-direction: row;
    }
`;

const PageTitle = styled.div`   
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Nunito Sans";
    font-size: 1rem;
    font-weight: bold;
    box-sizing: border-box;
    color: white;
    background-color: ${(props) => props.isDeleted ? 'red' : 'var(--background)'};
    padding: .8rem;
    width: 100%;

    @media screen and (min-width: 768px){
        font-size: 1.5rem;
  }
`

const CardContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 1rem;
    border: 1px solid rgba(11, 35, 97, 0.3);
    overflow: hidden;
    width: 90%;

    @media screen and (min-width: 1000px){
        width: 48%;
        height: 80%;
    }
`   

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: .8rem;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    box-sizing: border-box;
    background-color: ${(props) => props.isDeleted ? 'red' : 'var(--background)'};

    & svg{
        fill: white;
        transition: all 0.3s ease-in-out;

        &:hover{
            cursor: pointer;
            transform: scale(1.1);
        }
    }
`

const MainTitle = styled.h1`
    font-family: 'Nunito Sans', sans-serif;
    text-align: center;
    font-size: 1.5rem;
    width: 100%;
    color: white;
`;

const InformationContentContainer = styled.section`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: 1rem;
    overflow-y: auto;
    padding: 1rem;
    height: 100%;
    width: 100%;
`;

const SubHeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
`;

const Subtitle = styled.h1`
    font-family: 'Nunito Sans', sans-serif;
    font-size: 1.2rem;
    color: var(--background);

    @media screen and (min-width: 768px){
    font-size: 1.5rem;
    }
`;

const InfoText = styled.p`
    font-size: 1rem;
    font-weight: 600;
    color: ${(props) => props.color || "var(--background)"};
`

const Label = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    color: black;
`;

const ItemList = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    width: 100%;
    gap: 1rem;

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

const Item = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    border-radius: 0.5rem;
    padding: 1rem;
    background-color: ${(props) => props.backgroundColor || "rgba(245, 246, 250, 1)"};
    transition: all 0.3s ease-in-out;
`;

const ItemElementContainer = styled.div`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    gap: .2rem;
`

const ItemElement = styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    gap: .2rem;
`

function ViewTransfer() {
    const [transfer, setTransfer] = useState({});
    const [transferItems, setTransferItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotify();
    const { transferID } = useParams();
    const [copyCodes, setCopyCodes] = useState([]);
    const navigate = useNavigate();

    async function fetchTransferById() {
        setLoading(true);
        try {

            const response = await getTransfersById(transferID);

            if (!response.success) {
                throw new Error(response.message);
            } else {
                setTransfer(response.transfer);
                setTransferItems(response.transfer.items);

                document.title = `View TF | ${new Date(response.transfer.created_at).toLocaleString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                        dateStyle: "short",
                    })}
                `;
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    function copyToClipboard(text, index){
        setCopyCodes([...copyCodes, index]);
        navigator.clipboard.writeText(eanIncrement(text));
        addNotification("Código copiado");
    }

    useEffect(() => {
        document.title = "View TF";
        fetchTransferById();
    }, []);

    // async function handleMoveToBin(id) {
    //     setLoading(true);
    //     try {
    //         const response = await movetransferToBin(id);

    //         if (response.success) {
    //             navigate("/dashboard");
    //             addNotification(response.message);
    //             return;
    //         }

    //         addNotification(response.message);
    //     } catch (error) {
    //         addNotification(error.message || "Erro ao mover para lixeira");
    //     }
    //     setLoading(false);
    // }

    function handleExport() {
        if (transferItems.length === 0){ 
          addNotification("Nenhum item encontrado!");
          return;
        }

        const txt = transferItems.map((item, index) => `EAN ${index + 1}: ${item.ean}\nQTD: ${item.quantity}`).join("\n\n");
        const blob = new Blob([txt], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Relação TF ${new Date(transfer.created_at).toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                dateStyle: "short",
            })}.txt
        `;
        link.click();
    }

    function getTotalQuantity(){
        let total = 0;
        transferItems.forEach((item) => {
            total += item.quantity;
        });
        return total;
    }

    function eanIncrement(ean){
        if(ean.length <= 4){
            const newEan = ean.padStart(13, "0");

            return newEan
        }

        return ean
    }

    return loading ? (
        <Container>
            <SmallLoad/> 
        </Container>
    ) : transfer.id && transfer.items ? (
            <Container>
                <PageTitle isDeleted={transfer.isDeleted}> 
                    {transfer.isDeleted ? "VISUALIZAÇÃO DE TF EXCLUÍDA" : "SUPERMERCADOS ELIZA"}
                </PageTitle>

                <ContentContainer>

                    <CardContentContainer>
                        <HeaderContainer isDeleted={transfer.isDeleted}>
                            <MainTitle>Relação de Transferência - #{transferID}</MainTitle>
                        </HeaderContainer>

                        <InformationContentContainer>
                            <SubHeaderContainer>
                                <Subtitle>
                                    Informações
                                </Subtitle>
                            </SubHeaderContainer>

                            <ItemList>
                                <Item>
                                    <Label>ID:</Label>
                                    <InfoText>{transfer.id}</InfoText>
                                </Item>

                                <Item>
                                    <Label>Usuário:</Label>
                                    <InfoText>{transfer.user_add}</InfoText>
                                </Item>
                                        
                                <Item>
                                    <Label>Data:</Label>
                                    <InfoText>
                                        {new Date(transfer.created_at).toLocaleString("pt-BR", {
                                            timeZone: "America/Sao_Paulo",
                                            dateStyle: "short",
                                        })}
                                    </InfoText>
                                </Item>
                            </ItemList>
                        </InformationContentContainer>
                    </CardContentContainer>

                    <CardContentContainer>
                        <HeaderContainer isDeleted={transfer.isDeleted}>
                            <ExportSVG data-tooltip-id="export" onClick={handleExport}/>
                            <MainTitle>Itens</MainTitle>
                            <CheckSVG style={{ display: transfer.isDeleted ? "none" : "unset" }} data-tooltip-id="check"/>

                            <Tooltip id="export" place="top" content="Exportar itens"/>
                            <Tooltip id="check" place="top" content="Marcar como concluída"/>
                        </HeaderContainer>

                        <InformationContentContainer>
                            <SubHeaderContainer>
                                <Subtitle>
                                    Quantidade total: {getTotalQuantity()}
                                </Subtitle>
                            </SubHeaderContainer>
                            <ItemList>
                                {transferItems.map((item, index) => (
                                    <Item style={{ cursor: "pointer" }}  onClick={() => copyToClipboard(item.ean, index)} key={index} backgroundColor={copyCodes.includes(index) ? "rgba(71, 255, 141, 1)" : "" }>
                                        <ItemElementContainer> 
                                            <ItemElement>
                                                <InfoText color="black">Descrição:</InfoText>
                                                <InfoText>{item.description}</InfoText>
                                            </ItemElement>
                                            <ItemElement>
                                                <InfoText color="black">EAN {index + 1}:</InfoText>
                                                <InfoText>
                                                    {eanIncrement(item.ean)}
                                                </InfoText>
                                            </ItemElement>
                                        </ItemElementContainer> 

                                        <ItemElement>
                                            <InfoText color="black">Qtd:</InfoText>
                                            <InfoText>
                                                {item.quantity}
                                            </InfoText>
                                        </ItemElement>
                                    </Item>
                                ))}
                            </ItemList>
                        </InformationContentContainer>
                    </CardContentContainer>
                </ContentContainer>
            </Container>
        ) : (
            <Container backgroundColor="var(--background)">
                <PageTitle>
                    TRANSFERÊNCIA NÃO ENCONTRADA
                </PageTitle>
            </Container> 
        );
}

export default ViewTransfer;