import { motion, Reorder } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import cardFragment1 from "./assets/card-fragment-1.png";
import cardFragment2 from "./assets/card-fragment-2.png";
import fullCard from "./assets/full-card.png";
import tangledPath from "./assets/tangled-path.svg";

type Feedback = "idle" | "error" | "success";
type Letter = { id: string; char: string };

const initialLetters: Letter[] = [
    { id: "sha", char: "Ш" },
    { id: "i", char: "И" },
    { id: "r", char: "Р" },
    { id: "a-1", char: "А" },
    { id: "a-2", char: "А" },
    { id: "m", char: "М" },
];

const targetName = "МАРИША";
const fragments = [cardFragment1, cardFragment2, fullCard];
const revealTitles = ["Первая часть открыта!", "Ещё одна часть на месте!", "Открытка собрана!"];

function Progress({ current }: { current: number }) {
    return (
        <div className="progress-bar" aria-label={`Задание ${current} из 3`}>
            <span>{current} / 3</span>
            <div className="progress-bar__track" aria-hidden="true">
                <motion.div
                    className="progress-bar__fill"
                    initial={{ width: `${((current - 1) / 3) * 100}%` }}
                    animate={{ width: `${(current / 3) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

function Puzzle() {
    const { n } = useParams();
    const navigate = useNavigate();
    const puzzleNumber = Number(n);
    const resetTimer = useRef<number | null>(null);
    const [feedback, setFeedback] = useState<Feedback>("idle");
    const [isComplete, setIsComplete] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedPath, setSelectedPath] = useState<number | null>(null);
    const [letters, setLetters] = useState<Letter[]>(initialLetters);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

    const clearResetTimer = () => {
        if (resetTimer.current !== null) {
            window.clearTimeout(resetTimer.current);
            resetTimer.current = null;
        }
    };

    useEffect(() => {
        setFeedback("idle");
        setIsComplete(false);
        setSelectedOption(null);
        setSelectedPath(null);
        setLetters(initialLetters);
        setSelectedLetter(null);
        return clearResetTimer;
    }, [puzzleNumber]);

    if (![1, 2, 3].includes(puzzleNumber)) {
        return <Navigate to="/" replace />;
    }

    const succeed = () => {
        clearResetTimer();
        setFeedback("success");
        resetTimer.current = window.setTimeout(() => setIsComplete(true), 550);
    };

    const fail = (reset: () => void) => {
        clearResetTimer();
        setFeedback("error");
        resetTimer.current = window.setTimeout(() => {
            reset();
            setFeedback("idle");
        }, 850);
    };

    const chooseEmoji = (emoji: string) => {
        if (feedback !== "idle") return;
        setSelectedOption(emoji);
        if (emoji === "🎁") {
            succeed();
        } else {
            fail(() => setSelectedOption(null));
        }
    };

    const choosePath = (path: number) => {
        if (feedback !== "idle") return;
        setSelectedPath(path);
        if (path === 3) {
            succeed();
        } else {
            fail(() => setSelectedPath(null));
        }
    };

    const selectLetterForSwap = (id: string) => {
        if (feedback !== "idle") return;
        if (selectedLetter === null) {
            setSelectedLetter(id);
            return;
        }
        if (selectedLetter === id) {
            setSelectedLetter(null);
            return;
        }
        const firstIndex = letters.findIndex((letter) => letter.id === selectedLetter);
        const secondIndex = letters.findIndex((letter) => letter.id === id);
        const nextLetters = [...letters];
        [nextLetters[firstIndex], nextLetters[secondIndex]] = [nextLetters[secondIndex], nextLetters[firstIndex]];
        setLetters(nextLetters);
        setSelectedLetter(null);
    };

    const checkName = () => {
        if (feedback !== "idle") return;
        if (letters.map((letter) => letter.char).join("") === targetName) {
            succeed();
        } else {
            setSelectedLetter(null);
            fail(() => setLetters(initialLetters));
        }
    };

    const renderPuzzle = () => {
        if (puzzleNumber === 1) {
            const options = ["🏀", "🎁", "🎷", "🍕"];
            return (
                <>
                    <p className="puzzle-kicker">Заполни пропуск</p>
                    <h1 className="puzzle-title">Формула праздника</h1>
                    <p className="puzzle-instruction">Выбери то, без чего день рождения — не день рождения.</p>
                    <motion.div
                        className="equation"
                        animate={feedback === "error" ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
                        transition={{ duration: 0.45 }}
                        aria-label={`Женщина плюс ${selectedOption ?? "пропуск"} равно праздник`}
                    >
                        <span aria-hidden="true">👩🏻</span>
                        <span aria-hidden="true">+</span>
                        <span className={`equation__blank ${feedback === "error" ? "equation__blank--error" : ""}`}>
                            {selectedOption ?? ""}
                        </span>
                        <span aria-hidden="true">=</span>
                        <span aria-hidden="true">🎉</span>
                    </motion.div>
                    <div className="option-grid">
                        {options.map((emoji) => (
                            <button
                                className={`option-button ${selectedOption === emoji && feedback === "error" ? "option-button--error" : ""}`}
                                disabled={feedback !== "idle"}
                                key={emoji}
                                onClick={() => chooseEmoji(emoji)}
                                type="button"
                                aria-label={`Выбрать ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </>
            );
        }

        if (puzzleNumber === 2) {
            const buttonPositions = [20.73, 38.54, 58.54, 77.56];
            return (
                <>
                    <p className="puzzle-kicker">Распутай дорожки</p>
                    <h1 className="puzzle-title">Свободная ниточка</h1>
                    <p className="puzzle-instruction">Нажми на номер ниточки, которая не привязана ни к одному шарику.</p>
                    <motion.div
                        className="path-frame"
                        animate={feedback === "error" ? { rotate: [0, -1.5, 1.5, -1, 1, 0] } : { rotate: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        <img src={tangledPath} alt="Три шарика и четыре перепутанные ниточки" draggable="false" />
                        {buttonPositions.map((left, index) => {
                            const value = index + 1;
                            const stateClass = selectedPath === value
                                ? feedback === "error"
                                    ? "path-button--error"
                                    : feedback === "success"
                                        ? "path-button--success"
                                        : ""
                                : "";
                            return (
                                <button
                                    className={`path-button ${stateClass}`}
                                    disabled={feedback !== "idle"}
                                    key={value}
                                    onClick={() => choosePath(value)}
                                    style={{ left: `${left}%` }}
                                    type="button"
                                    aria-label={`Выбрать ниточку номер ${value}`}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </motion.div>
                </>
            );
        }

        return (
            <>
                <p className="puzzle-kicker">Собери слово</p>
                <h1 className="puzzle-title">Как зовут именинницу?</h1>
                <p className="puzzle-instruction">Перетаскивай буквы в нужном порядке. Можно также нажать на две буквы, чтобы поменять их местами.</p>
                <div className="letters-target" aria-hidden="true">
                    {targetName.split("").map((_, index) => <span key={index}>?</span>)}
                </div>
                <motion.div
                    animate={feedback === "error" ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <Reorder.Group
                        axis="x"
                        className="letters-list"
                        values={letters}
                        onReorder={feedback === "idle" ? setLetters : () => undefined}
                        aria-label="Буквы имени"
                    >
                        {letters.map((letter) => (
                            <Reorder.Item
                                className={`letter-tile ${selectedLetter === letter.id ? "letter-tile--selected" : ""}`}
                                dragListener={feedback === "idle"}
                                key={letter.id}
                                value={letter}
                                tabIndex={0}
                                onClick={() => selectLetterForSwap(letter.id)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        selectLetterForSwap(letter.id);
                                    }
                                }}
                                aria-label={`Буква ${letter.char}. Нажмите, чтобы выбрать для перестановки.`}
                            >
                                {letter.char}
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </motion.div>
                <div className="letter-actions">
                    <button className="secondary-button" disabled={feedback !== "idle"} onClick={checkName} type="button">
                        Проверить
                    </button>
                </div>
            </>
        );
    };

    if (isComplete) {
        const nextPath = puzzleNumber === 3 ? "/result" : `/puzzle/${puzzleNumber + 1}`;
        return (
            <motion.main
                className="app-page reveal-page"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
            >
                <motion.div
                    initial={{ scale: 0.6, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 190, damping: 16 }}
                >
                    <h1>{revealTitles[puzzleNumber - 1]}</h1>
                </motion.div>
                <p>{puzzleNumber === 3 ? "Вот она — целиком. Остался последний шаг." : "Так держать, открытка становится всё наряднее."}</p>
                <motion.div
                    className="card-preview"
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.5 }}
                >
                    <img src={fragments[puzzleNumber - 1]} alt={`Открытая часть открытки ${puzzleNumber} из 3`} />
                </motion.div>
                <button className="primary-button" onClick={() => navigate(nextPath)} type="button">
                    {puzzleNumber === 3 ? "Получить открытку" : "Следующее задание"}
                    <span aria-hidden="true">→</span>
                </button>
            </motion.main>
        );
    }

    const feedbackText = feedback === "error"
        ? puzzleNumber === 3 ? "Почти! Попробуй собрать имя ещё раз." : "Не эта! Попробуй ещё раз."
        : feedback === "success" ? "Верно! Открываем часть открытки…" : "";

    return (
        <motion.main
            className="app-page puzzle-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
        >
            <Progress current={puzzleNumber} />
            <section className="puzzle-shell">
                {renderPuzzle()}
                <p className={`feedback feedback--${feedback}`} aria-live="polite">{feedbackText}</p>
            </section>
        </motion.main>
    );
}

export default Puzzle;
