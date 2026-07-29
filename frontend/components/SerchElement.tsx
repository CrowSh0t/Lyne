export default function SearchElement({ text }: { text: string }) {
    return (
        <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-large">Search {text}</h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
                <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded" />
                <button className="bg-black flex justify-center items-center py-3 text-white w-full sm:w-1/3 text-base sm:text-2xl sm:mt-auto rounded-lg">
                    Add the {text}
                </button>
            </div>
        </div>
    );
}