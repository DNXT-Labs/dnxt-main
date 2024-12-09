import React, { useState } from 'react';
import SearchFilter from "./SearchFilter";
import { Listbox, Transition } from '@headlessui/react'
import { CiViewList } from "react-icons/ci";
import { HiViewGrid } from "react-icons/hi";
import { BiChevronDown } from "react-icons/bi";
import './Explorer.css';


const ExplorerTopbar = ({ onChangeDisplayMode, onSearch, onSortOptionChange, nftData }) => {
    const [activeTab, setActiveTab] = useState('list');

    const sortOptions = [
        'Price: low to high',
        'Price: high to low',
        'Recently listed',
        'Best offer',
        'Highest last sale',
        'Recently sold',
        'Recently created',
        'Most viewed',
        'Oldest',
        'Most favorited',
        'Ending soon',
        'Recently received'
    ];

    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

    // This function is called whenever a new sort option is selected.
    const handleSortChange = (value) => {
        // Update the state with the new sort option.
        setSelectedSort(value);

        // Call the onSortOptionChange function passed from the parent component.
        onSortOptionChange(value);
    };

    const handleTabClick = (mode) => {
        setActiveTab(mode);
        onChangeDisplayMode(mode);
    };


    return (
        <div className="topbar-container">

            <div className="topbar-item">
                <SearchFilter onSearch={onSearch} nftData={nftData} />
            </div>
            <div className="topbar-item">
                <Listbox value={selectedSort} onChange={handleSortChange}>
                    <Listbox.Button className={selectedSort ? 'custom-active' : 'custom-inactive'}>
                        <div className="sort-content">
                            <span>{selectedSort || "Sort"}</span>
                            <BiChevronDown />
                        </div>                    </Listbox.Button>
                    <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="listbox-options">
                            {sortOptions.map((sort, sortIdx) => (
                                <Listbox.Option
                                    key={sortIdx}
                                    className={({ active }) =>
                                        `${active ? 'listbox-option listbox-option-active' : 'listbox-option'}`
                                    }
                                    value={sort}
                                >
                                    {sort}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            </div>


            <div className="topbar-item buttons-container">
                <button className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => handleTabClick('list')}>
                    <CiViewList />
                </button>

                <button className={`tab ${activeTab === 'card' ? 'active' : ''}`} onClick={() => handleTabClick('card')}>
                    <HiViewGrid />
                </button>
            </div>
        </div>
    );
}

export default ExplorerTopbar;
