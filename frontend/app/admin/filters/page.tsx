import SearchElement from "../Components/SerchElement";


const colDesign = "bg-[#F6F6F6] flex flex-row w-1/4 font-bold"
export default function FiltersPage(){
    return(
        <div className="p-12">
            <SearchElement text="Filters"/>
            <div className="flex flex-row gap-4 py-4 px-2 bg-white">
                <div className={colDesign}>
                    <h1>Sort by</h1>
                    <button className="flex ml-auto">
                        <img src={"/images/admin/icons/AddFiltersIcon.png"}></img>
                    </button>
                </div>
                <div className={colDesign}>
                    <h1>Category</h1>
                    <button className="flex ml-auto">
                        <img src={"/images/admin/icons/AddFiltersIcon.png"}></img>
                    </button>
                </div>
                <div className={colDesign}>
                    <h1>Brand</h1>
                    <button className="flex ml-auto">
                        <img src={"/images/admin/icons/AddFiltersIcon.png"}></img>
                    </button>
                </div>
                <div className={colDesign}>
                    <h1>Size</h1>
                    <button className="flex ml-auto">
                        <img src={"/images/admin/icons/AddFiltersIcon.png"}></img>
                    </button>
                </div>
            </div>
        </div>
        
    );
}