import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`;

const Svg = styled.svg`
    animation-name: bump9;
    animation-timing-function: linear;
    width: 4rem; 
    height: 4rem;

    .main-svg, .worm{
        animation-duration: 3s;
        animation-iteration-count: infinite;
    }

    .ring{
        stroke: transparent;
        transition: stroke 0.3s;
    }

    .worm{
        animation-name: worm9;
        animation-timing-function: cubic-bezier(0.42,0.17,0.75,0.83);

        @keyframes worm9 {
            from {
                stroke-dashoffset: 10;
            }

            25% {
                stroke-dashoffset: 295;
            }

            to {
                stroke-dashoffset: 1165;
            }
        }
    }

    @keyframes bump9 {
        from,
        42%,
        46%,
        51%,
        55%,
        59%,
        63%,
        67%,
        71%,
        74%,
        78%,
        81%,
        85%,
        88%,
        92%,

        to {
            transform: translate(0,0);
        }

        44% {
            transform: translate(1.33%,6.75%);
        }

        53% {
            transform: translate(-16.67%,-0.54%);
        }

        61% {
            transform: translate(3.66%,-2.46%);
        }

        69% {
            transform: translate(-0.59%,15.27%);
        }

        76% {
            transform: translate(-1.92%,-4.68%);
        }

        83% {
            transform: translate(9.38%,0.96%);
        }

        90% {
            transform: translate(-4.55%,1.98%);
        }
    }

    @media screen and (min-width: 600px) {
        width: 7rem; 
        height: 7rem;
    }
`;

function SmallLoad() {
    return (
        <Container>
            <Svg className="main-svg" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary-color"/>
                        <stop offset="100%" stopColor="var(--background)"/>
                    </linearGradient>
                </defs>
                <circle className="ring" r="56" cx="64" cy="64" fill="none" strokeWidth="16" strokeLinecap="round"></circle>
                <path className="worm" d="M92,15.492S78.194,4.967,66.743,16.887c-17.231,17.938-28.26,96.974-28.26,96.974L119.85,59.892l-99-31.588,57.528,89.832L97.8,19.349,13.636,88.51l89.012,16.015S81.908,38.332,66.1,22.337C50.114,6.156,36,15.492,36,15.492a56,56,0,1,0,56,0Z" fill="none" stroke="url(#grad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44 1111" strokeDashoffset="10"></path>
            </Svg>
        </Container>
    );
}

export default SmallLoad