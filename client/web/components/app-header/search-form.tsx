import React, { useRef, useState } from 'react';
import { Input } from 'antd';
import style from './search-form.style.module.scss';
import { debounce } from 'lodash';
import Link from '../link';
import { GithubIcon } from '../../icons';
import spinner64 from './spinner-64.gif';
import { searchArticles } from '@blog/client/web/api';

const SearchResultList = (props: { isLoading: boolean; items: { _id: string; title: string }[] }) => {
    const { isLoading, items } = props;
    return (
        <ul className={style.searchList}>
            {!isLoading &&
                items.map((item: { _id: string; title: string }) => (
                    <li key={item._id}>
                        <Link href={'/blog/articles/' + item._id} passHref={true}>
                            <a>{item.title}</a>
                        </Link>
                    </li>
                ))}
            {isLoading && <span style={{ backgroundImage: `url(${spinner64.src})` }}></span>}
        </ul>
    );
};

const SearchResultFooter = (props: { isLoading: boolean; totalCount: number }) => {
    const { isLoading, totalCount } = props;
    return (
        <div className={style.panelFooter}>
            {isLoading ? (
                <div>Tìm kiếm dữ liệu...</div>
            ) : (
                <div>
                    <GithubIcon width="16px" height="16px"></GithubIcon>
                    {totalCount <= 0 ? 'Không có kết quả tìm kiếm' : `共 ${totalCount} Bản ghi thanh, thử các từ khóa khác 👍`}
                </div>
            )}
        </div>
    );
};

export const SearchForm = (props) => {
    const cacheEmptyKey = Symbol('cache init data');
    const cache = {};
    const $input = useRef<HTMLInputElement>(null);
    const [isActiveNavSearchDropdown, setIsActiveNavSearchDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [totalCount, setTotalCount] = useState(-1);

    const fetchData = (key: string) => {
        const data = cache[key === '' ? cacheEmptyKey : key];
        if (data) {
            setItems(data.items);
            setTotalCount(data.totalCount);
            return Promise.resolve();
        }
        setIsLoading(true);
        return searchArticles(key).then((_) => {
            if (_.data) {
                if (key === '') {
                    cache[cacheEmptyKey] = _.data;
                } else {
                    cache[key] = _.data;
                }
                setItems(_.data.items);
                setTotalCount(_.data.totalCount);
                setTimeout(() => {
                    setIsLoading(false);
                }, 400);
            }
        });
    };
    const debounceFetchData = debounce(fetchData, 200);

    const onfocus = () => {
        debounceFetchData('');
        setIsActiveNavSearchDropdown(true);
    };
    const onblur = () => {
        setIsActiveNavSearchDropdown(false);
    };
    const oninput = (e: React.MouseEvent<HTMLInputElement>) => {
        if (e.target instanceof HTMLInputElement) {
            debounceFetchData(e.target.value);
        }
    };
    const foldNavList = () => {
        setIsActiveNavSearchDropdown(false);
        if ($input.current) {
            $input.current.blur();
        }
    };
    return (
        <div className={style.searchForm} style={props.style}>
            <Input.Search
                onSearch={() => {
                    setIsActiveNavSearchDropdown(() => {
                        return true;
                    });
                }}
                onFocus={onfocus}
                onInput={oninput}
                onBlur={onblur}
                placeholder="Vui lòng nhập từ khóa"
            />
            <div
                onMouseDown={(event) => event.preventDefault()}
                className={style.searchPanel}
                style={{ display: isActiveNavSearchDropdown ? 'block' : 'none' }}
            >
                <div className={style.panelHeader}>
                    Blog
                    <span onClick={foldNavList}>Cất đi</span>
                </div>
                <SearchResultList items={items} isLoading={isLoading}></SearchResultList>
                <SearchResultFooter isLoading={isLoading} totalCount={totalCount}></SearchResultFooter>
            </div>
        </div>
    );
};
