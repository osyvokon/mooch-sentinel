#!/usr/bin/env python
try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

setup(
    name='Mooch Sentinel',
    version='0.0.1',
    description="Keep you from mooching unless chores are done",
    packages=find_packages(exclude=['ez_setup']),
    install_requires=[
        'flask',
    ],
)
