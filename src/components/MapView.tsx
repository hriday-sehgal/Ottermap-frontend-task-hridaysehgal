import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '../context/UserContext';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { OSM } from 'ol/source';
import { Draw, Modify, Snap, Select } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Trash2, Pencil, Square, X } from 'lucide-react';
import 'ol/ol.css';
import { Feature } from 'ol';
import { Geometry } from 'ol/geom';

function MapView() {
  const { firstName } = useUser();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);
  const selectInteractionRef = useRef<Select | null>(null);
  const [activeMode, setActiveMode] = useState<'draw' | 'edit' | 'delete' | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize vector source
    vectorSourceRef.current = new VectorSource();

    // Create vector layer
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    });

    // Initialize map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.dispose();
      }
    };
  }, []);

  const clearAllInteractions = () => {
    if (!mapInstanceRef.current) return;

    // Remove draw interaction if exists
    if (drawInteractionRef.current) {
      mapInstanceRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    // Remove modify interaction
    const modify = mapInstanceRef.current.getInteractions().getArray()
      .find(interaction => interaction instanceof Modify);
    if (modify) {
      mapInstanceRef.current.removeInteraction(modify);
    }

    // Remove select interaction if exists
    if (selectInteractionRef.current) {
      mapInstanceRef.current.removeInteraction(selectInteractionRef.current);
      selectInteractionRef.current = null;
    }

    setActiveMode(null);
  };

  const handleDraw = () => {
    if (!mapInstanceRef.current || !vectorSourceRef.current) return;

    // If already in draw mode, exit it
    if (activeMode === 'draw') {
      clearAllInteractions();
      return;
    }

    clearAllInteractions();
    setActiveMode('draw');

    // Create new draw interaction
    drawInteractionRef.current = new Draw({
      source: vectorSourceRef.current,
      type: 'Polygon',
    });

    // Add snap interaction
    const snap = new Snap({
      source: vectorSourceRef.current,
    });

    mapInstanceRef.current.addInteraction(drawInteractionRef.current);
    mapInstanceRef.current.addInteraction(snap);
  };

  const handleEdit = () => {
    if (!mapInstanceRef.current || !vectorSourceRef.current) return;

    // If already in edit mode, exit it
    if (activeMode === 'edit') {
      clearAllInteractions();
      return;
    }

    clearAllInteractions();
    setActiveMode('edit');

    // Add modify interaction
    const modify = new Modify({
      source: vectorSourceRef.current,
    });
    mapInstanceRef.current.addInteraction(modify);
  };

  const handleDelete = () => {
    if (!mapInstanceRef.current || !vectorSourceRef.current) return;

    // If already in delete mode, exit it
    if (activeMode === 'delete') {
      clearAllInteractions();
      return;
    }

    clearAllInteractions();
    setActiveMode('delete');

    // Create and add new select interaction for deletion
    selectInteractionRef.current = new Select();
    mapInstanceRef.current.addInteraction(selectInteractionRef.current);

    // Add select event listener
    const handleSelect = (e: any) => {
      const selectedFeatures = e.selected as Feature<Geometry>[];
      if (selectedFeatures.length > 0) {
        vectorSourceRef.current?.removeFeature(selectedFeatures[0]);
        selectInteractionRef.current?.getFeatures().clear();
      }
    };

    selectInteractionRef.current.on('select', handleSelect);
  };

  const getButtonClass = (mode: 'draw' | 'edit' | 'delete' | null) => {
    return `p-2 rounded-lg shadow-lg ${
      activeMode === mode
        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
        : 'bg-white text-indigo-600 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-indigo-600 text-white py-4">
        <h1 className="text-2xl font-bold text-center">{firstName}'s Map</h1>
      </header>
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0"></div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleDraw}
            className={getButtonClass('draw')}
            title={activeMode === 'draw' ? 'Exit Draw Mode' : 'Draw Polygon'}
          >
            {activeMode === 'draw' ? <X className="h-6 w-6" /> : <Square className="h-6 w-6" />}
          </button>
          <button
            onClick={handleEdit}
            className={getButtonClass('edit')}
            title={activeMode === 'edit' ? 'Exit Edit Mode' : 'Edit Polygons'}
          >
            {activeMode === 'edit' ? <X className="h-6 w-6" /> : <Pencil className="h-6 w-6" />}
          </button>
          <button
            onClick={handleDelete}
            className={getButtonClass('delete')}
            title={activeMode === 'delete' ? 'Exit Delete Mode' : 'Delete Polygons'}
          >
            {activeMode === 'delete' ? <X className="h-6 w-6" /> : <Trash2 className="h-6 w-6" />}
          </button>
        </div>
        {activeMode && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg">
            <p className="text-sm font-medium text-gray-700">
              {activeMode === 'draw' && 'Click to draw polygon vertices. Double-click to finish.'}
              {activeMode === 'edit' && 'Click and drag polygon vertices to edit.'}
              {activeMode === 'delete' && 'Click on a polygon to delete it.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapView;