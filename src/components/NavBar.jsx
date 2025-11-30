import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, CircleUser, Menu, X } from "lucide-react";
import toast from "react-hot-toast";
import ottSmall from "../../public/OTT.png";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileReportsOpen, setMobileReportsOpen] = useState(false);
  const [mobileDSP, setMobileDSP] = useState(false);

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#F5EDE0] border-b border-gray-200 sticky top-0 z-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-start gap-10 py-6">

          <div className="flex items-center gap-3">
            <img
              src={ottSmall}
              alt="OTT Solutions"
              className="w-10 h-10 rounded-sm object-cover shadow-sm"
            />
            <span className="text-sm font-semibold text-gray-700">OTT Solutions</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-red-500 font-semibold hover:text-red-600">Home</a>

            <details className="relative group">
              <summary className="cursor-pointer text-gray-800 font-medium hover:text-gray-600 flex items-center gap-1 list-none">
                Reports <ChevronDown size={14} />
              </summary>

              <div className="absolute left-0 mt-3 w-72 bg-white border rounded-lg shadow-lg p-2 z-20">
                <details className="mb-1">
                  <summary className="cursor-pointer px-3 py-2 rounded-md text-sm font-semibold text-rose-600 hover:bg-gray-50 flex justify-between">
                    DSP <ChevronRight size={14} />
                  </summary>

                  <ul className="ml-4 mt-2 space-y-2 bg-gray-50 p-3 rounded-md ">
                    <li>
                      <a href="/artist" className="block px-2 py-1 text-sm hover:bg-white rounded border">Artist</a>
                    </li>
                    <li>
                      <a href="/album" className="block px-2 py-1 text-sm hover:bg-white rounded border">Album</a>
                    </li>
                    <li>
                      <a href="/track" className="block px-2 py-1 text-sm hover:bg-white rounded border">Track</a>
                    </li>
                  </ul>
                </details>

                <a href="/callerTune" className="block px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-gray-50 rounded-md">
                  Caller Tune
                </a>
              </div>
            </details>

            <a href="/repertoire" className="text-gray-800 font-medium hover:text-gray-600">Repertoire</a>
            <a href="/newSongs" className="text-gray-800 font-medium hover:text-gray-600">New Songs</a>
            <a href="/resource" className="text-gray-800 font-medium hover:text-gray-600">Resource</a>
            <a href="/contact" className="text-gray-800 font-medium hover:text-gray-600">Contact</a>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="mt-3 flex items-center gap-1 px-3 py-2 bg-gray-100 border rounded-lg text-sm font-semibold cursor-pointer"
              >
                <CircleUser className="text-rose-600" />
                Account
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-lg py-2 animate-fade">
                  <button
                    onClick={() => toast.error("Page not found")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    My Profile
                  </button>

                  <button
                    onClick={() => toast.error("Page not found")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
              className="p-2 rounded-md bg-white shadow-sm"
            >
              {mobileOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 py-4 animate-slideDown">

          <a href="/" className="block py-2 text-red-500 font-semibold">Home</a>

          <div>
            <button
              className="w-full flex justify-between items-center py-2 font-medium text-gray-800"
              onClick={() => setMobileReportsOpen(!mobileReportsOpen)}
            >
              Reports <ChevronDown size={16} className={`${mobileReportsOpen ? "rotate-180" : ""} transition`} />
            </button>

            {mobileReportsOpen && (
              <div className="pl-4 mt-2">

                <button
                  className="w-full flex justify-between items-center py-2 text-sm font-semibold text-rose-600"
                  onClick={() => setMobileDSP(!mobileDSP)}
                >
                  DSP <ChevronDown size={14} className={`${mobileDSP ? "rotate-180" : ""} transition`} />
                </button>

                {mobileDSP && (
                  <ul className="pl-4 mt-2 space-y-2">
                    <li><a className="block py-1 text-sm border rounded px-2" href="/artist">Artist</a></li>
                    <li><a className="block py-1 text-sm border rounded px-2" href="/album">Album</a></li>
                    <li><a className="block py-1 text-sm border rounded px-2" href="/track">Track</a></li>
                  </ul>
                )}

                <a href="/callerTune" className="block py-2 text-sm font-semibold text-rose-600">Caller Tune</a>
              </div>
            )}
          </div>

          <a href="/repertoire" className="block py-2 text-gray-800">Repertoire</a>
          <a href="/newSongs" className="block py-2 text-gray-800">New Songs</a>
          <a href="/resource" className="block py-2 text-gray-800">Resource</a>
          <a href="/contact" className="block py-2 text-gray-800">Contact</a>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen(!open)}
              className="mt-3 flex items-center gap-1 px-3 py-2 bg-gray-100 border rounded-lg text-sm font-semibold cursor-pointer"
            >
              <CircleUser className="text-rose-600" />
              Account
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-lg py-2 animate-fade">
                <button
                  onClick={() => toast.error("Page not found")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  My Profile
                </button>

                <button
                  onClick={() => toast.error("Page not found")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">
                  Log Out
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
}
