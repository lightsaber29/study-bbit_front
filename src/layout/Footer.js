import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8">
      <div className="container mx-auto px-4">
        {/* 회사 정보 */}
        <div className="border-gray-600">
          <p className="text-sm text-gray-400">
            <strong className="text-white">StudyBBit 스터디빗</strong>  주소: 대전광역시 대전 유성구 문지로 193
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Copyrights 2024. Studybbit All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
