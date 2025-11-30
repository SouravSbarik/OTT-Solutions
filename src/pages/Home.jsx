import Navbar from "../components/NavBar";
import rightPanelImg from "../../public/right-panel.png";
import Chart from "../components/Chart";
import ChartPie from "../components/ChartPie";
import CallerTuneStacked from "../components/CallerTuneStacked";
import MapComponent from "../components/MapComponent";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            <div className="flex">
                <div className="flex-1 min-h-screen flex flex-col">
                    <Navbar />

                    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="max-w-6xl mx-auto">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                                TUNE 0
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-white rounded-2xl shadow"><Chart title="Streams by Language" /></div>
                                <div className="p-6 bg-white rounded-2xl shadow"><Chart title="Income by Artist" /></div>
                                <div className="p-6 bg-white rounded-2xl shadow"><ChartPie title="Language and Total Revenue" /></div>
                                <div className="p-6 bg-white rounded-2xl shadow"><CallerTuneStacked title="Caller Tune Overview" groupBy="language" /></div>
                            </div>
                            <MapComponent />
                        </div>
                    </main>
                </div>

                <div className="flex min-h-screen">
                    <div className="hidden xl:block w-96 relative">
                        <img
                            src={rightPanelImg}
                            alt="Sidebar Design"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>


            </div>
            <Footer />
        </div>
    );
}
