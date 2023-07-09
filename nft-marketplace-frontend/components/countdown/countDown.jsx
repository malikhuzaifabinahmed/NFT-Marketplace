import React, { useState, useEffect } from "react";

// Component that takes remaining time in seconds at instance of component load
const CountdownComponent = ({ remainingSeconds }) => {
    // Declare a state variable for the time left and initialize it with the remaining seconds
    const [timeLeft, setTimeLeft] = useState(remainingSeconds);

    // Declare a state variable for the date object and initialize it with the current date plus the remaining seconds
    const [endDate, setEndDate] = useState(
        new Date(Date.now() + remainingSeconds * 1000)
    );

    // Declare a function that converts seconds to hours, minutes and seconds
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h}:${m}:${s}`;
    };

    // Declare a function that formats the date object to a string
    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = date.getMonth() + 1; // getMonth returns 0-11
        const d = date.getDate();
        return `  ${d} / ${m} / ${y} `;
    };

    // Use an effect hook to set up a timer that updates the time left every second
    useEffect(() => {
        // If the time left is zero or negative, return early
        if (timeLeft <= 0) {
            return;
        }

        // Create a timer id using setInterval
        const timerId = setInterval(() => {
            // Update the time left by subtracting one second
            setTimeLeft(timeLeft - 1);
        }, 1000);

        // Return a cleanup function that clears the timer
        return () => clearInterval(timerId);
    }, [timeLeft]); // Pass timeLeft as a dependency to re-run the effect when it changes

    return (
        <div>
            <p>
                Remaing time :{" "}
                {timeLeft > 0 ? (
                    <span>{formatTime(timeLeft)}</span>
                ) : (
                    <span>Time's up!</span>
                )}{" "}
            </p>
            <p>Date : {formatDate(endDate)}</p>
        </div>
    );
};

export default CountdownComponent;
