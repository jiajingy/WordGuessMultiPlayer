import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./CountdownTimer.css";

export default function CountdownTimer(props: any) {

    const timerTextHtml = ({remainingTime}) =>{
        if (remainingTime === 0)
            return <div className="timer">{props.completeText}</div>;

        return (
            <div className="timer">
                <div className="text">{props.playingText}</div>
                <div className="value">{remainingTime}</div>
                <div className="text">seconds</div>
            </div>
        )
    }
    return (
        <div className="timer-wrapper">
            <CountdownCircleTimer
                isPlaying={props.isPlaying}
                duration={props.duration}
                colors={"#004777"}
                colorsTime={props.duration}
            >
                {timerTextHtml}
            </CountdownCircleTimer>
        </div>
    )
}

