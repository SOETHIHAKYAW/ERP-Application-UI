import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { Table, Button } from '../common';
import FixedAssetForm from './FixedAssetForm';
import './FixedAssetList.css'; // Assuming you have a CSS file for styling

const FixedAssetList = () => {
    const [assets, setAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const { get, delete: del } = useApi();

    useEffect(() => {
        get('/api/fixed-assets')
            .then(response => setAssets(response.data))
            .catch(error => console.error('Error fetching fixed assets:', error));
    }, []);

    const handleDelete = (id) => {
        del(`/api/fixed-assets/${id}`)
            .then(() => setAssets(prev => prev.filter(asset => asset.id !== id)))
            .catch(error => console.error('Error deleting fixed asset:', error));
    };

    return (
        <div>
            <Button onClick={() => setSelectedAsset({})}>Add New Fixed Asset</Button>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map(asset => (
                        <tr key={asset.id}>
                            <td>{asset.id}</td>
                            <td>{asset.name}</td>
                            <td>{asset.value}</td>
                            <td>
                                <Button onClick={() => setSelectedAsset(asset)}>Edit</Button>
                                <Button onClick={() => handleDelete(asset.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {selectedAsset && (
                <FixedAssetForm
                    assetId={selectedAsset.id}
                    onClose={() => setSelectedAsset(null)}
                    onSave={(updatedAsset) => {
                        setAssets(prev => prev.map(asset =>
                            asset.id === updatedAsset.id ? updatedAsset : asset
                        ));
                        setSelectedAsset(null);
                    }}
                />
            )}
        </div>
    );
};

export default FixedAssetList;
