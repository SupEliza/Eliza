import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNoteById } from "../../services/notes";
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
    background-color: rgba(245, 246, 250, 1);
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
    background-color: var(--background);
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

const TitleContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: .8rem;
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    box-sizing: border-box;
    background-color: var(--background);
`

const MainTitle = styled.h1`
    font-family: 'Nunito Sans', sans-serif;
    font-size: 1.5rem;
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

const SubtitleContentContainer = styled.div`
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
    background-color: rgba(245, 246, 250, 1);
`;

const ItemElement = styled.div`
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    gap: .2rem;
`

function View() {
    const [note, setNote] = useState({});
    const [noteItens, setNoteItens] = useState([]);
    const [loading, setLoading] = useState(false);
    const { noteID } = useParams();

    async function fetchNoteById() {
        setLoading(true);
        try {

            const response = await getNoteById(noteID);

            if (!response.success) {
                throw new Error(response.message);
            } else {
                setNote(response.note);
                setNoteItens(response.note.itens);
                document.title = `View NF | ${response.note.company}`;
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    function copyToClipboard(text){
        navigator.clipboard.writeText(text);
        alert("Código copiado");
    }

    useEffect(() => {
        document.title = "View NF";
        fetchNoteById();
    }, []);

    return loading ? (
        <Container>
            <SmallLoad/> 
        </Container>
    ) : note.length === 0 ?  <Container><PageTitle>NOTA NÃO ENCONTRADA</PageTitle></Container> : 
        (
            <Container>
                <PageTitle>
                    SUPERMERCADOS ELIZA
                </PageTitle>

                <ContentContainer>


                    <CardContentContainer>
                        <TitleContentContainer>
                            <MainTitle>Relação de Nota - #{noteID}</MainTitle>
                        </TitleContentContainer>

                        <InformationContentContainer>
                            <SubtitleContentContainer>
                                <Subtitle>
                                    Informações
                                </Subtitle>
                            </SubtitleContentContainer>

                            <ItemList>
                                <Item>
                                    <Label>Empresa:</Label>
                                    <InfoText>{note.company}</InfoText>
                                </Item>

                                <Item>
                                    <Label>Boleto:</Label>
                                    <InfoText>{note.ticket ? "Sim" : "Não"}</InfoText>
                                </Item>

                                <Item>
                                    <Label>Usuário:</Label>
                                    <InfoText>{note.user_add}</InfoText>
                                </Item>

                                <Item>
                                    <Label>Data de Coleta:</Label>
                                    <InfoText>
                                        {new Date(note.collection_date).toLocaleString("pt-BR", {
                                        timeZone: "UTC",
                                        dateStyle: "short",
                                        })}
                                    </InfoText>
                                </Item>
                                        
                                <Item>
                                    <Label>Data de Criação:</Label>
                                    <InfoText>
                                        {new Date(note.created_at).toLocaleString("pt-BR", {
                                            timeZone: "America/Sao_Paulo",
                                            dateStyle: "short",
                                        })}
                                    </InfoText>
                                </Item>
                            </ItemList>
                        </InformationContentContainer>
                    </CardContentContainer>

                    <CardContentContainer>
                        <TitleContentContainer>
                            <MainTitle>Itens</MainTitle>
                        </TitleContentContainer>

                        <InformationContentContainer>
                            <SubtitleContentContainer>
                                <Subtitle>
                                    Total de itens: {noteItens.length}
                                </Subtitle>
                            </SubtitleContentContainer>
                            <ItemList>
                                {noteItens.map((item, index) => (
                                    <Item>
                                        <ItemElement>
                                            <InfoText color="black">Código:</InfoText>
                                            <InfoText style={{ cursor: "pointer" }} onClick={() => copyToClipboard(item.codigo)}>
                                                {item.codigo}
                                            </InfoText>
                                        </ItemElement>

                                        <ItemElement>
                                            <InfoText color="black">Qtd:</InfoText>
                                            <InfoText>
                                                {item.quantidade}
                                            </InfoText>
                                        </ItemElement>
                                    </Item>
                                ))}
                            </ItemList>
                        </InformationContentContainer>
                    </CardContentContainer>
                </ContentContainer>
            </Container>
        );
}

export default View;