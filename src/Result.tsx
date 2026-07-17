import { motion } from "framer-motion";
import fullCard from "./assets/full-card.png";

function Result() {
    return (
        <motion.main
            className="app-page result-page"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <p className="eyebrow">Ура, все задания выполнены!</p>
            <h1>С днём рождения, Мариша! 💐</h1>
            <p className="result-page__message">
                Пусть этот день будет таким же ярким, добрым и волшебным, как ты. Твоя открытка готова — сохрани её себе!
            </p>
            <motion.div
                className="card-preview"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12, duration: 0.55 }}
            >
                <img src={fullCard} alt="Поздравительная открытка для Мариши" />
            </motion.div>
            <motion.a
                className="primary-button download-button"
                href={fullCard}
                download="Открытка для Мариши.png"
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.98 }}
            >
                <span aria-hidden="true">↓</span>
                Скачать открытку
            </motion.a>
        </motion.main>
    );
}

export default Result;
