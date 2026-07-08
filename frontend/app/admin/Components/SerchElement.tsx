export default function SearchElement({ text }: { text: string }) {
    return (
        <div>
            <h1 className="text-4xl font-large">Search {text}</h1>
            <div className="flex flex-row pt-2">
                <input className="w-full bg-gray-100 border-none outline-none px-3 py-2 rounded" />
                <button className="bg-black flex justify-center items-center py-3 text-white w-1/3 text-2xl mt-auto rounded-lg">
                    Add the {text}
                </button>
            </div>
        </div>
    );
}