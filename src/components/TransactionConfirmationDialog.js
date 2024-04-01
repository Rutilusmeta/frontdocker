import React, { useState, useEffect } from 'react';

import { useNFTMarketplace } from '../contexts/NFTMarketplaceContext';

const TransactionConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
    const { getTransactionFees } = useNFTMarketplace();
    const [loading, setLoading] = useState(false);
    const [fees, setFees] = useState(null);

    useEffect(() => {
        const fetchTransactionFees = async () => {
            setLoading(true);
           try {
                const fees = await getTransactionFees();
                setFees(fees);
            } catch (error) {
                console.error('Error fetching transaction fees:', error);
            } finally {
                setLoading(false);
            }
        };
        if (isOpen) {
            fetchTransactionFees();
        }
    }, [isOpen, getTransactionFees]);

    if (!isOpen) return null;

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
                <div className="relative bg-white w-96 rounded-lg shadow-xl">
                    <div className="p-6 text-black">
                        <h2 className="text-xl font-bold mb-4">Confirm Transaction</h2>
                        {loading && <p>Loading...</p>}
                        {!loading && (
                            <>
                                <p className="text-gray-600 mb-4">Are you sure you want to proceed with this transaction?</p>
                                {fees && (
                                    <p className="text-gray-600 mb-8">Estimated Transaction Fees: {fees} ETH</p>
                                )}
                                <div className="flex justify-end">
                                    <button className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300" onClick={onClose}>Cancel</button>
                                    <button className="px-4 py-2 bg-blue-500 text-black rounded-md hover:bg-blue-600" onClick={onConfirm}>Confirm</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionConfirmationDialog;
